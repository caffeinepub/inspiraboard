import { Badge } from '../ui/badge';
import { useGetAllTags } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface TagChipsProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagChips({ selectedTag, onTagSelect }: TagChipsProps) {
  const { data: tags, isLoading } = useGetAllTags();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  const uniqueTags = Array.from(new Set(tags));

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueTags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
