import { useState, useEffect, useRef } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetMessages, useSendMessage } from '../../hooks/useQueries';
import { usePolling } from '../../hooks/usePolling';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Send, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { UserProfile } from '../../backend';

interface MessageThreadProps {
  otherUserId: string;
  otherUserProfile: UserProfile;
}

export default function MessageThread({ otherUserId, otherUserProfile }: MessageThreadProps) {
  const { identity } = useInternetIdentity();
  const [messageText, setMessageText] = useState('');
  const { data: messages, refetch } = useGetMessages(otherUserId);
  const sendMessage = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  usePolling(() => {
    refetch();
  }, 3000, true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    await sendMessage.mutateAsync({
      to: otherUserId,
      content: messageText.trim(),
    });

    setMessageText('');
  };

  const currentUserId = identity?.getPrincipal().toString();
  const avatarUrl = otherUserProfile.avatar?.getDirectURL();

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{otherUserProfile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{otherUserProfile.displayName}</p>
          <p className="text-sm text-muted-foreground">{otherUserProfile.bio}</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => {
              const isOwn = message.sender.toString() === currentUserId;
              const timestamp = new Date(Number(message.timestamp) / 1000000);

              return (
                <div key={message.id.toString()} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="border-t border-border p-4 flex gap-2">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sendMessage.isPending || !messageText.trim()}>
          {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
