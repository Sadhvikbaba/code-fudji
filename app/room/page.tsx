"use client";

import EditorPage from "../pages/MonacoEditor";
import {GridLayout, ParticipantTile, RoomAudioRenderer, useTracks, RoomContext} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import ChatUI from "../pages/ChatPage";
import { FolderCode, Loader2, MessageCircleMore } from "lucide-react";
import CustomControlBar from "../components/CustomControlBar";
import { useDataReceived } from "../hooks/chat";
import { useLiveKitSync } from "../hooks/liveKit";
import { useFileTreeSync } from "../hooks/useFileTreeSync";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addFileToTree, resetFileState } from "../store/fileSlice";
import { setInitialMessages } from "../store/chatSlice";

export default function Home() {
  const getQueryParam = (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const match = window.location.search.match(new RegExp(`[?&]${key}=([^&]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const [show, setShow] = useState<'editor' | 'chat'>('editor');
  const [loading, setLoading] = useState(true);

  const room = getQueryParam('room') || 'default-room';
  const name = getQueryParam('username') || 'guest';

  const [roomInstance] = useState(() => new Room({
    adaptiveStream: true,
    dynacast: true,
  }));
  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room}&username=${name}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) {
          await roomInstance.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, data.token);
        }
        if(mounted)setTimeout(() => setLoading(false), 1000);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [room, name, roomInstance]);

  useLiveKitSync(roomInstance);
  useFileTreeSync(roomInstance);
  useDataReceived(roomInstance);

  interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  children?: FileSystemItem[];
  size?: number;
  lastModified?: number;
}
interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}


  const dispatch = useDispatch();
  const fileTree = useSelector((state: RootState) => state.file.fileTree);
  const messages = useSelector((state: RootState) => state.chat.messages);

  useEffect(() => {
    const stored = localStorage.getItem("fileTree");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch(resetFileState());
        (parsed as FileSystemItem[]).forEach((file) => dispatch(addFileToTree(file)));
      } catch (e) {
        console.error("Failed to parse local file tree:", e);
      }
    }
  }, [dispatch]);

  useEffect(() => {
  const stored = localStorage.getItem("chatMessages");
  if (stored) {
    try {
      const parsed: Message[] = JSON.parse(stored);
      dispatch(setInitialMessages(parsed));
    } catch (e) {
      console.error("Failed to parse chat messages:", e);
    }
  }
}, [dispatch]);

  useEffect(() => {
    localStorage.setItem("fileTree", JSON.stringify(fileTree));
  }, [fileTree]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  if (loading) return <div className="flex items-center justify-center h-screen text-white"><Loader2 className="animate-spin"/></div>;

  return (
    <RoomContext.Provider value={roomInstance}>
      <div className="flex scrollMe ">
        <div className="flex flex-col items-center  w-[5%] bg-[#252526] py-6 border-r border-gray-700">
            <div className={`mb-2 px-6 py-2 ${show === 'editor' ? 'pl-3 bg-blue-600/30 border-l-2 border-blue-400' : 'text-white'}`} onClick={() => setShow('editor')} >
              <FolderCode/>
            </div>
            <div className={`px-6 py-2  ${show === 'chat' ? 'pl-3 bg-blue-600/30 border-l-2 border-blue-400' : 'text-white'}`} onClick={() => setShow('chat')}>
              <MessageCircleMore/>
            </div>
          </div>
        <div className="w-[80%]">
          {show == 'editor' ?<EditorPage room={roomInstance}/>
           : <ChatUI room={roomInstance} name={name} roomName={room}/>}
        </div>
        <div data-lk-theme="default" style={{ height: '100dvh' }} className="w-[20%] overflow-auto bg-[#252526] border-l border-gray-700">
          <CustomControlBar />
          <MyVideoConference />
          <RoomAudioRenderer />
        </div>
      </div>
    </RoomContext.Provider>
  );
}


function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
