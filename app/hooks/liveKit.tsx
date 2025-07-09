import { useEffect, useCallback, useRef } from 'react';
import { Room, RoomEvent, RemoteParticipant } from 'livekit-client';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { syncFileContent, addFileToTree, removeFileFromTree, renameFile as renameFileAction , resetFileState} from '../store/fileSlice';
import { FileSystemItem } from '../store/fileSlice';

type LiveKitMessage =
  | {
      type: 'file_content_change';
      payload: FileContentChangePayload;
      timestamp: number;
      userId: string;
    }
  | {
      type: 'file_created';
      payload: FileCreatedPayload;
      timestamp: number;
      userId: string;
    }
  | {
      type: 'file_deleted';
      payload: FileDeletedPayload;
      timestamp: number;
      userId: string;
    }
  | {
      type: 'file_renamed';
      payload: FileRenamedPayload;
      timestamp: number;
      userId: string;
    }
  | {
      type: 'file_tree_sync';
      payload: FileTreeSyncPayload;
      timestamp: number;
      userId: string;
    };


interface FileContentChangePayload {
  path: string;
  content: string;
}

interface FileCreatedPayload {
  file: FileSystemItem;
}

interface FileDeletedPayload {
  path: string;
}

interface FileRenamedPayload {
  oldPath: string;
  newName: string;
}

interface FileTreeSyncPayload {
  files: FileSystemItem[];
}

export const useLiveKitSync = (room: Room | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const lastSentTimestamp = useRef<number>(0);
  const hasSynced = useRef(false);

  // Send file content change to all participants
  const sendFileContentChange = useCallback(async (path: string, content: string) => {
    if (!room || !room.localParticipant) return;

    const timestamp = Date.now();
    lastSentTimestamp.current = timestamp;

    const message: LiveKitMessage = {
      type: 'file_content_change',
      payload: { path, content } as FileContentChangePayload,
      timestamp,
      userId: room.localParticipant.identity,
    };

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(message));
      await room.localParticipant.publishData(data, { reliable: true });
    } catch (error) {
      console.error('Error sending file content change:', error);
    }
  }, [room]);

  // Send file creation to all participants
  const sendFileCreated = useCallback(async (file: FileSystemItem) => {
    if (!room || !room.localParticipant) return;

    const message: LiveKitMessage = {
      type: 'file_created',
      payload: { file } as FileCreatedPayload,
      timestamp: Date.now(),
      userId: room.localParticipant.identity,
    };

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(message));
      await room.localParticipant.publishData(data, { reliable: true });
    } catch (error) {
      console.error('Error sending file created:', error);
    }
  }, [room]);

  // Send file deletion to all participants
  const sendFileDeleted = useCallback(async (path: string) => {
    if (!room || !room.localParticipant) return;

    const message: LiveKitMessage = {
      type: 'file_deleted',
      payload: { path } as FileDeletedPayload,
      timestamp: Date.now(),
      userId: room.localParticipant.identity,
    };

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(message));
      await room.localParticipant.publishData(data, { reliable: true });
    } catch (error) {
      console.error('Error sending file deleted:', error);
    }
  }, [room]);

  // Send file rename to all participants
  const sendFileRenamed = useCallback(async (oldPath: string, newName: string) => {
    if (!room || !room.localParticipant) return;

    const message: LiveKitMessage = {
      type: 'file_renamed',
      payload: { oldPath, newName } as FileRenamedPayload,
      timestamp: Date.now(),
      userId: room.localParticipant.identity,
    };

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(message));
      await room.localParticipant.publishData(data, { reliable: true });
    } catch (error) {
      console.error('Error sending file renamed:', error);
    }
  }, [room]);

  // Handle incoming data messages
  const handleDataReceived = useCallback((
    payload: Uint8Array,
    participant?: RemoteParticipant
  ) => {
    
    if (!room || !room?.localParticipant || !participant) return;

    // Don't process our own messages
    if (participant?.identity === room?.localParticipant?.identity) return;

    try {
      const decoder = new TextDecoder();
      const messageStr = decoder.decode(payload);
      const message: LiveKitMessage = JSON.parse(messageStr);

      // Don't process messages older than our last sent message
      if (message.timestamp <= lastSentTimestamp.current) return;
      

      switch (message.type) {
        case 'file_content_change':
          const contentPayload = message.payload as FileContentChangePayload;
          dispatch(syncFileContent({
            path: contentPayload.path,
            content: contentPayload.content,
            timestamp: message.timestamp
          }));
          break;
        case 'file_tree_sync':
        if (!hasSynced.current) {
          const treePayload = message.payload as FileTreeSyncPayload;
          dispatch(resetFileState());
          treePayload.files.forEach(file => dispatch(addFileToTree(file)));
          hasSynced.current = true;
        }
        break;

        case 'file_created':
          const createPayload = message.payload as FileCreatedPayload;
          dispatch(addFileToTree(createPayload.file));
          break;

        case 'file_deleted':
          const deletePayload = message.payload as FileDeletedPayload;
          dispatch(removeFileFromTree(deletePayload.path));
          break;

        case 'file_renamed':
          const renamePayload = message.payload as FileRenamedPayload;
          dispatch(renameFileAction({
            oldPath: renamePayload.oldPath,
            newName: renamePayload.newName
          }));
          break;

        default:
      }
    } catch (error) {
      console.error('Error processing received data:', error);
    }
  }, [room, dispatch]);

  // Set up event listeners
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array, participant?: RemoteParticipant) => {
      handleDataReceived(payload, participant);
    };

    room.on(RoomEvent.DataReceived, handleData);

    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, handleDataReceived]);

  return {
    sendFileContentChange,
    sendFileCreated,
    sendFileDeleted,
    sendFileRenamed,
  };
};

// Custom hook for debounced file content changes
export const useDebounceFileSync = (
  room: Room | null,
  delay: number = 500
) => {
  const { sendFileContentChange } = useLiveKitSync(room);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSendContent = useCallback((path: string, content: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      sendFileContentChange(path, content);
    }, delay);
  }, [sendFileContentChange, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSendContent;
};

// Custom hook for file management operations
export const useFileOperations = (room: Room | null) => {
  const { sendFileCreated, sendFileDeleted, sendFileRenamed } = useLiveKitSync(room);

  const createFile = useCallback((file: FileSystemItem) => {
    sendFileCreated(file);
  }, [sendFileCreated]);

  const deleteFile = useCallback((path: string) => {
    sendFileDeleted(path);
  }, [sendFileDeleted]);

  const renameFile = useCallback((oldPath: string, newName: string) => {
    sendFileRenamed(oldPath, newName);
  }, [sendFileRenamed]);

  return {
    createFile,
    deleteFile,
    renameFile,
  };
};