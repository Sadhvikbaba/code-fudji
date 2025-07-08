import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SendHorizonal, Users, Settings, Search, MoreVertical, Smile, Paperclip, Phone, Video, Rocket } from 'lucide-react';
import { Room } from 'livekit-client';
import { addMessage } from '../store/chatSlice';

interface Message {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ParticipantData {
  sid: number;
  identity: string;
  status: 'online' | 'away' | 'offline';
  joinedAt: string;
}

interface ChatUIProps {
  room: Room;
  name: string;
  roomName: string;
}

interface LiveKitMessage {
  type: 'chat';
  message: string;
  timestamp?: string;
  userId?: string;
}

interface RootState {
  chat: {
    messages: Message[];
  };
}

const ChatUI: React.FC<ChatUIProps> = ({ room, name, roomName }) => {
  const [message, setMessage] = useState<string>('');
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  
  const dispatch = useDispatch();
  
  const messages = useSelector((state: RootState) => state.chat.messages);

  const sendMessage = async (): Promise<void> => {
    if (message.trim()) {
      try {
        const messageData: LiveKitMessage = {
          type: 'chat',
          message: message.trim(),
          timestamp: new Date().toISOString(),
          userId: name 
        };
        
        const payload = new TextEncoder().encode(JSON.stringify(messageData));
        await room.localParticipant.publishData(payload);
        
        const newMessage: Message = {
          id: Date.now(),
          user: 'You',
          message: message.trim(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true
        };
        
        // Dispatch to Redux store instead of local state
        dispatch(addMessage(newMessage));
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const getInitials = (name: string): string => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleSendMessage = (): void => {
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      const res = await fetch(`/api/participants?roomName=${roomName}`);
      const data = await res.json();
      setParticipants(data.participants);
    };
    fetchParticipants();
  }, [room, roomName]);

  return (
    <div className="flex h-screen bg-[#252526]">
      {/* Sidebar - Participants */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#007FFF] to-[#2a52be] bg-clip-text text-transparent">
              Code Fudji
            </h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-200" />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white"
            />
          </div>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Participants ({participants.length || 0})
              </h3>
            </div>
            
            <div className="space-y-2">
              {(participants && participants.length > 0) && participants.map((participant) => (
                <div key={participant.sid} className="flex items-center p-2 hover:bg-[#007ACC] rounded-lg cursor-pointer transition-colors text-gray-500 hover:text-white">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#007FFF] to-[#2a52be] flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(participant.identity)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-700 bg-green-500`}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-white">{participant.identity}</p>
                    <p className="text-xs">{new Date(Number(participant.joinedAt) * 1000).toLocaleString().split(',')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#007FFF] to-[#2a52be] flex items-center justify-center text-white font-semibold text-sm mr-3">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-500">Team Chat - {roomName}</h1>
                <p className="text-sm text-gray-500">{participants.length} members online</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-600 hover:text-white rounded-lg transition-colors text-gray-600 cursor-pointer">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-600 hover:text-white rounded-lg transition-colors text-gray-600 cursor-pointer">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-600 hover:text-white rounded-lg transition-colors text-gray-600 cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-xs lg:max-w-md ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-[#007FFF] to-[#2a52be] flex items-center justify-center text-white font-semibold text-xs ${msg.isOwn ? 'ml-2' : 'mr-2'} flex-shrink-0`}>
                  {getInitials(msg.user)}
                </div>
                <div className={`rounded-lg px-4 py-2 ${msg.isOwn ? 'bg-gradient-to-r from-[#007FFF] to-[#2a52be] text-white' : ' border border-gray-700'}`}>
                  <p className={`text-xs font-medium mb-1 ${msg.isOwn ? 'text-violet-100' : 'text-gray-100'}`}>
                    {msg.user}
                  </p>
                  <p className={`text-sm text-white`}>
                    {msg.message}
                  </p>
                  <p className={`text-xs mt-1 ${msg.isOwn ? 'text-violet-100' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-700">
          <div className="flex space-x-3">
            <button className="p-2 rounded-lg transition-colors ml-3 cursor-pointer">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 relative mt-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full resize-none rounded-lg px-4 py-3 pr-12 outline-none border-transparent text-white bg-transparent"
                rows={1}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded cursor-pointer">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <button onClick={handleSendMessage}
              className="p-4 bg-gradient-to-r text-gray-600 rounded-lg cursor-pointer"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;