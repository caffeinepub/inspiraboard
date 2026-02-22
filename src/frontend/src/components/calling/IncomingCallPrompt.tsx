import { useNavigate } from '@tanstack/react-router';
import { useCallStore } from '../../hooks/useCallSignaling';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../ui/alert-dialog';
import { Phone, Video } from 'lucide-react';

export default function IncomingCallPrompt() {
  const navigate = useNavigate();
  const { incomingCall, acceptCall, declineCall } = useCallStore();

  if (!incomingCall) return null;

  const handleAccept = () => {
    acceptCall();
    navigate({ to: `/call/${incomingCall.from}` });
  };

  const handleDecline = () => {
    declineCall();
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {incomingCall.type === 'video' ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            Incoming {incomingCall.type === 'video' ? 'Video' : 'Voice'} Call
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have an incoming {incomingCall.type} call. Would you like to answer?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDecline}>Decline</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
