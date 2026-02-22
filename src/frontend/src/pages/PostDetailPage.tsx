import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useGetFeed } from '../hooks/useQueries';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MessageCircle, Phone, Video, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useCallStore } from '../hooks/useCallSignaling';

export default function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { data: posts, isLoading } = useGetFeed();
  const { setActiveCall } = useCallStore();

  const post = posts?.find((p) => p.id === postId);

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Post not found</h2>
        <Button onClick={() => navigate({ to: '/' })}>Back to Feed</Button>
      </div>
    );
  }

  const imageUrl = post.image.getDirectURL();
  const avatarUrl = post.author.avatar?.getDirectURL();
  const createdAt = new Date(Number(post.createdAt) / 1000000);
  const authorId = post.author.id.toString();

  const handleVoiceCall = () => {
    setActiveCall({ with: authorId, type: 'voice', isInitiator: true });
    navigate({ to: '/call/$userId', params: { userId: authorId } });
  };

  const handleVideoCall = () => {
    setActiveCall({ with: authorId, type: 'video', isInitiator: true });
    navigate({ to: '/call/$userId', params: { userId: authorId } });
  };

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img src={imageUrl} alt={post.caption} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Link to="/profile/$userId" params={{ userId: authorId }}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>{post.author.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <Link to="/profile/$userId" params={{ userId: authorId }} className="font-semibold hover:underline">
                  {post.author.displayName}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div>
              <p className="text-lg">{post.caption}</p>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-2">
              <p className="text-sm font-medium mb-3">Connect with {post.author.displayName}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/messages' })}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" size="icon" onClick={handleVoiceCall}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleVideoCall}>
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
