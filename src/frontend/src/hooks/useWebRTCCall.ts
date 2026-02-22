import { useState, useRef, useEffect } from 'react';

export interface WebRTCCallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isConnected: boolean;
}

export function useWebRTCCall(callType: 'voice' | 'video') {
  const [state, setState] = useState<WebRTCCallState>({
    localStream: null,
    remoteStream: null,
    isMuted: false,
    isCameraOff: callType === 'voice',
    isConnected: false,
  });

  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const startCall = async () => {
    try {
      const constraints = {
        audio: true,
        video: callType === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setState((prev) => ({ ...prev, localStream: stream }));

      // In a real implementation, this would set up WebRTC peer connection
      // and exchange SDP/ICE candidates via the backend
      setTimeout(() => {
        setState((prev) => ({ ...prev, isConnected: true }));
      }, 1000);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const toggleMute = () => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = state.isMuted;
        setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
      }
    }
  };

  const toggleCamera = () => {
    if (state.localStream && callType === 'video') {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = state.isCameraOff;
        setState((prev) => ({ ...prev, isCameraOff: !prev.isCameraOff }));
      }
    }
  };

  const endCall = () => {
    if (state.localStream) {
      state.localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setState({
      localStream: null,
      remoteStream: null,
      isMuted: false,
      isCameraOff: callType === 'voice',
      isConnected: false,
    });
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return {
    ...state,
    startCall,
    toggleMute,
    toggleCamera,
    endCall,
  };
}
