import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import type { PostMetadata } from '../../backend';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: PostMetadata;
}

export default function PostCard({ post }: PostCardProps) {
  const imageUrl = post.image.getDirectURL();
  const avatarUrl = post.author.avatar?.getDirectURL();
  const createdAt = new Date(Number(post.createdAt) / 1000000);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link to="/post/$postId" params={{ postId: post.id }} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={post.caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <p className="text-sm font-medium line-clamp-2 mb-3">{post.caption}</p>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="text-xs">{post.author.displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{post.author.displayName}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(createdAt, { addSuffix: true })}</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
