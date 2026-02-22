import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import type { UserProfile } from '../../backend';

interface Conversation {
  userId: string;
  profile: UserProfile;
  lastMessage?: string;
  timestamp?: Date;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <img src="/assets/generated/empty-messages.dim_1200x800.png" alt="No messages" className="w-64 h-auto mb-4" />
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">Start a conversation from a user's profile</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => {
          const avatarUrl = conversation.profile.avatar?.getDirectURL();
          const isSelected = selectedUserId === conversation.userId;

          return (
            <Button
              key={conversation.userId}
              variant={isSelected ? 'secondary' : 'ghost'}
              className="w-full justify-start h-auto py-3 px-3"
              onClick={() => onSelectConversation(conversation.userId)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{conversation.profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{conversation.profile.displayName}</p>
                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
