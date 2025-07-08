import { useState } from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { LogOut, Mic, MicOff, MonitorUp, Video, VideoOff } from 'lucide-react';
import { useDownloadZip } from '../lib/zipAndDownload';

export default function CustomControlBar() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [micEnabled, setMicEnabled] = useState(localParticipant.isMicrophoneEnabled);
  const [camEnabled, setCamEnabled] = useState(localParticipant.isCameraEnabled);
  const [screenSharing, setScreenSharing] = useState(false);

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(!micEnabled);
    setMicEnabled(!micEnabled);
  };

  const toggleCamera = async () => {
    await localParticipant.setCameraEnabled(!camEnabled);
    setCamEnabled(!camEnabled);
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      await localParticipant.setScreenShareEnabled(true);
      setScreenSharing(true);
    } else {
      await localParticipant.setScreenShareEnabled(false);
      setScreenSharing(false);
    }
  };

  const downloadZip = useDownloadZip()

  const leaveRoom = async () => {
    downloadZip();
    room.disconnect();
    window.location.href = '/';
  };

  return (
    <div className="flex gap-2 justify-center py-1 bg-[#252526] border-b border-gray-700 text-gray-400">
      <button onClick={toggleMic} className="px-4 py-2 rounded cursor-pointer">
        {micEnabled ? <Mic/> : <MicOff/>}
      </button>
      <button onClick={toggleCamera} className="px-4 py-2  rounded cursor-pointer">
        {camEnabled ? <Video/> : <VideoOff/>}
      </button>
      <button onClick={toggleScreenShare} className="px-4 py-2  rounded cursor-pointer">
        <MonitorUp/>
      </button>
      <button onClick={leaveRoom} className="px-4 py-2 rounded cursor-pointer">
        <LogOut/>
      </button>
    </div>
  );
}
