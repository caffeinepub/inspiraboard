import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ConversationList from '../components/messages/ConversationList';
import MessageThread from '../components/messages/MessageThread';
import { Card } from '../components/ui/card';

export default function MessagesPage() {
  const { identity } = useInternetIdentity();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // In a real implementation, this would fetch actual conversations from the backend
  // For now, we show an empty state
  const conversations: any[] = [];

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <Card className="h-[calc(100vh-12rem)] overflow-hidden">
        <div className="grid md:grid-cols-[320px_1fr] h-full">
          <div className="border-r border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Messages</h2>
            </div>
            <ConversationList
              conversations={conversations}
              selectedUserId={selectedUserId}
              onSelectConversation={setSelectedUserId}
            />
          </div>

          <div className="hidden md:block">
            {selectedConversation ? (
              <MessageThread otherUserId={selectedConversation.userId} otherUserProfile={selectedConversation.profile} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <img src="/assets/generated/empty-messages.dim_1200x800.png" alt="Select a conversation" className="w-64 h-auto mb-4" />
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
