import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetFeed, useSearchPosts } from '../hooks/useQueries';
import PostCard from '../components/posts/PostCard';
import SearchBar from '../components/discovery/SearchBar';
import TagChips from '../components/discovery/TagChips';
import { Loader2 } from 'lucide-react';

export default function FeedPage() {
  const { identity } = useInternetIdentity();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const isSearching = !!searchTerm || !!selectedTag;

  const { data: feedPosts, isLoading: feedLoading } = useGetFeed();
  const { data: searchResults, isLoading: searchLoading } = useSearchPosts(searchTerm, selectedTag);

  const posts = isSearching ? searchResults : feedPosts;
  const isLoading = isSearching ? searchLoading : feedLoading;
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to InspiraBoard</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover inspiration, share your creativity, and connect with others.
          </p>
          <p className="text-muted-foreground">Please log in to get started.</p>
        </div>
      </div>
    );
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedTag(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchTerm('');
  };

  return (
    <div className="container py-8 pb-24 md:pb-8">
      <div className="mb-8 space-y-4">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        <TagChips selectedTag={selectedTag} onTagSelect={handleTagSelect} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img src="/assets/generated/empty-feed.dim_1200x800.png" alt="No posts" className="w-96 h-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">
            {isSearching ? 'No results found' : 'No posts yet'}
          </h2>
          <p className="text-muted-foreground">
            {isSearching ? 'Try a different search term or tag' : 'Be the first to share your inspiration!'}
          </p>
        </div>
      )}
    </div>
  );
}
