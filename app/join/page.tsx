"use client";

import React, { useState } from 'react';
import { Users, Copy, RefreshCw, User, ArrowRight, Rocket, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const generateRoomId = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setRoomId(result);
      setIsGenerating(false);
    }, 500);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  const handleEnterRoom = async () => {
    if (userName.trim() && roomId.trim()) {
      if (!roomId.match(/^[a-z0-9]{10}$/)) {
        alert('Invalid Room ID. Please enter a valid 10 character alphanumeric ID.');
        return;
      }
      
      setIsJoining(true);
      
      // Simulate loading delay
      setTimeout(() => {
        router.push(`/room/?room=${roomId}&username=${encodeURIComponent(userName)}`);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-row min-w-full">
      {/* Left side - Space background */}
      <div className="relative w-full lg:w-[65%] h-[250px] lg:h-auto bg-gradient-to-br from-slate-900 via-blue-900 to-black">
        {/* Space background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.4),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,197,253,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(30,58,138,0.2),transparent_50%)]"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-60 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-700"></div>
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-xl font-semibold text-white">
          <Rocket className="w-6 h-6" />
          <span>Code Fudji</span>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Collaborate in <span className="text-blue-400">Real-time</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              Join developers from around the world in seamless code collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[35%] px-6 py-10 bg-black/80 backdrop-blur-sm relative">
        {/* Background effects for right side */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,197,253,0.2),transparent_50%)]"></div>
        </div>
        
        <div className="w-full max-w-sm relative z-10">
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-white">Join a Room</h1>
              <p className="text-balance text-sm text-gray-300">
                Enter your details below to join a collaboration room
              </p>
            </div>

            {/* Form */}
            <div className="grid gap-6">
              {/* Name Input */}
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Room ID Input */}
              <div className="grid gap-2">
                <label htmlFor="roomId" className="text-sm font-medium text-gray-300">
                  Room ID
                </label>
                <div className="relative">
                  <input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    className="w-full pr-20 pl-4 py-2 bg-white/10 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      onClick={copyRoomId}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors duration-200"
                      title="Copy Room ID"
                      type="button"
                    >
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                    <button
                      onClick={generateRoomId}
                      disabled={isGenerating}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors duration-200"
                      title="Generate New Room ID"
                      type="button"
                    >
                      <RefreshCw className={`w-4 h-4 text-gray-400 hover:text-white ${isGenerating ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Join Room Button */}
              <button
                onClick={handleEnterRoom}
                disabled={!userName.trim() || !roomId.trim() || isJoining}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining Room...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Join Room</span>
                  </>
                )}
              </button>

              {/* Generate Room Link */}
              <div className="text-center">
                <button
                  onClick={generateRoomId}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                  type="button"
                >
                  Don&apos;t have a room ID? <span className="underline">Generate one</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-center mt-8 space-x-2 relative z-10">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-black flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 bg-blue-700 rounded-full border-2 border-black flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-gray-400 text-sm font-medium">
            +10,000 developers collaborating
          </span>
        </div>
      </div>
    </div>
  );
}