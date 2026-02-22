import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useCallStore } from '../hooks/useCallSignaling';
import { useWebRTCCall } from '../hooks/useWebRTCCall';
import { useGetUserProfile } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';

export default function CallPage() {
  const { userId } = useParams({ from: '/call/$userId' });
  const navigate = useNavigate();
  const { activeCall, endCall: endCallStore } = useCallStore();
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfile(userId);

  const callType = activeCall?.type || 'voice';
  const { localStream, remoteStream, isMuted, isCameraOff, isConnected, startCall, toggleMute, toggleCamera, endCall } = useWebRTCCall(callType);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startCall();
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEndCall = () => {
    endCall();
    endCallStore();
    navigate({ to: '/' });
  };

  if (profileLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">User not found</h2>
        <Button onClick={() => navigate({ to: '/' })}>Back to Feed</Button>
      </div>
    );
  }

  const avatarUrl = userProfile.avatar?.getDirectURL();

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex-1 relative">
        {callType === 'video' ? (
          <>
            <div className="absolute inset-0 bg-black">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="absolute top-4 right-4 w-48 aspect-video overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </Card>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-4xl">{userProfile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">{userProfile.displayName}</h2>
              <p className="text-muted-foreground">
                {isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-background/95 backdrop-blur border-t border-border">
        <div className="container max-w-md mx-auto flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? 'destructive' : 'secondary'}
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          {callType === 'video' && (
            <Button
              variant={isCameraOff ? 'destructive' : 'secondary'}
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={toggleCamera}
            >
              {isCameraOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
            </Button>
          )}

          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
