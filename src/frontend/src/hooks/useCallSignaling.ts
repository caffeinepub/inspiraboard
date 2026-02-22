import { create } from 'zustand';
import { usePolling } from './usePolling';

export type CallType = 'voice' | 'video';

export interface CallState {
  incomingCall: {
    from: string;
    type: CallType;
  } | null;
  activeCall: {
    with: string;
    type: CallType;
    isInitiator: boolean;
  } | null;
  setIncomingCall: (call: { from: string; type: CallType } | null) => void;
  setActiveCall: (call: { with: string; type: CallType; isInitiator: boolean } | null) => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  incomingCall: null,
  activeCall: null,
  setIncomingCall: (call) => set({ incomingCall: call }),
  setActiveCall: (call) => set({ activeCall: call }),
  acceptCall: () =>
    set((state) => {
      if (!state.incomingCall) return state;
      return {
        activeCall: {
          with: state.incomingCall.from,
          type: state.incomingCall.type,
          isInitiator: false,
        },
        incomingCall: null,
      };
    }),
  declineCall: () => set({ incomingCall: null }),
  endCall: () => set({ activeCall: null }),
}));

export function useIncomingCallPolling(enabled: boolean) {
  usePolling(
    () => {
      // In a real implementation, this would poll the backend for incoming call signals
      // For now, this is a placeholder that demonstrates the polling pattern
    },
    3000,
    enabled
  );
}
