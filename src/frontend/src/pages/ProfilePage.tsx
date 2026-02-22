import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserProfile, useGetCallerUserProfile, useGetFeed } from '../hooks/useQueries';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import ProfileEditor from '../components/profile/ProfileEditor';
import { Loader2, Edit, MessageCircle, Phone, Video } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useCallStore } from '../hooks/useCallSignaling';

export default function ProfilePage() {
  const { userId } = useParams({ from: '/profile/$userId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { setActiveCall } = useCallStore();

  const currentUserId = identity?.getPrincipal().toString();
  const isOwnProfile = currentUserId === userId;

  const { data: viewedProfile, isLoading: viewedLoading } = useGetUserProfile(userId);
  const { data: ownProfile, isLoading: ownLoading } = useGetCallerUserProfile();
  const { data: allPosts, isLoading: postsLoading } = useGetFeed();

  const profile = isOwnProfile ? ownProfile : viewedProfile;
  const isLoading = isOwnProfile ? ownLoading : viewedLoading;

  const userPosts = allPosts?.filter((post) => post.author.id.toString() === userId) || [];

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Profile not found</h2>
      </div>
    );
  }

  const avatarUrl = profile.avatar?.getDirectURL();

  const handleVoiceCall = () => {
    setActiveCall({ with: userId, type: 'voice', isInitiator: true });
    navigate({ to: '/call/$userId', params: { userId } });
  };

  const handleVideoCall = () => {
    setActiveCall({ with: userId, type: 'video', isInitiator: true });
    navigate({ to: '/call/$userId', params: { userId } });
  };

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-3xl">{profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold">{profile.displayName}</h1>
                  <p className="text-muted-foreground mt-2">{profile.bio}</p>
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <Button onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => navigate({ to: '/messages' })}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleVoiceCall}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleVideoCall}>
                        <Video className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Posts ({userPosts.length})</h2>
          {postsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : userPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userPosts.map((post) => (
                <Link key={post.id} to="/post/$postId" params={{ postId: post.id }}>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity">
                    <img
                      src={post.image.getDirectURL()}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              {isOwnProfile ? "You haven't posted anything yet" : 'No posts yet'}
            </p>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          {profile && <ProfileEditor profile={profile} onSaved={() => setIsEditDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
