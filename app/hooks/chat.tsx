import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Room, RemoteParticipant } from 'livekit-client';
import { addMessage } from '../store/chatSlice';

interface LiveKitMessage {
  type: 'chat';
  message: string;
  timestamp?: string;
  userId?: string;
}

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export const useDataReceived = (room: Room | null) => {

  if(!room)return;
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    const onDataReceived = (
      payload: Uint8Array, 
      participant?: RemoteParticipant, 
    ) => {
      try {
        const notificationSound = new Audio('/sound.mp3');
        const text = new TextDecoder().decode(payload);
        const data: LiveKitMessage = JSON.parse(text);

        if(data.type !== 'chat') {return;}
        
        const newMessage: Message = {
          id: Date.now(), 
          user: participant?.identity || 'Unknown User',
          message: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false
        };
        
        
        dispatch(addMessage(newMessage));

         notificationSound.play().catch((err) => {
          console.warn("Unable to play sound:", err);
        });
      } catch (error) {
        console.error('Error parsing received message:', error);
      }
    };
    
    room.on('dataReceived', onDataReceived);

    return () => {
      room.off('dataReceived', onDataReceived);
    };
  }, [room, dispatch]);
};