import { useNavigate } from '@tanstack/react-router';
import PostComposer from '../components/posts/PostComposer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function CreatePostPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostComposer onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
