import { useEffect } from 'react';
import { Room, RoomEvent, RemoteParticipant } from 'livekit-client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useFileTreeSync = (room: Room | null) => {
  const fileTree = useSelector((state: RootState) => state.file.fileTree);

  useEffect(() => {
    if (!room) return;

    const handleParticipantConnected = async (participant: RemoteParticipant) => {
      console.log('Participant connected:', participant.identity);
      
      if (!room.localParticipant) return;

      const message = {
        type: 'file_tree_sync',
        payload: { files: fileTree },
        timestamp: Date.now(),
        userId: room.localParticipant.identity,
      };

      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(message));

        setTimeout(async() => {
          await room.localParticipant.publishData(data, {
             reliable: true,
             destinationIdentities: [participant.identity], 
            });
        }, 1000);
      } catch (err) {
        console.error('Failed to sync file tree:', err);
      }
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);

    return () => {
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
    };
  }, [room, fileTree]);
};
