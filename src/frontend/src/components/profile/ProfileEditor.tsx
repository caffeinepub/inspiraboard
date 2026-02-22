import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { ExternalBlob, type UserProfile } from '../../backend';
import { Loader2, Upload } from 'lucide-react';

interface ProfileEditorProps {
  profile: UserProfile;
  onSaved?: () => void;
}

export default function ProfileEditor({ profile, onSaved }: ProfileEditorProps) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    profile.avatar ? profile.avatar.getDirectURL() : undefined
  );
  const [avatarBlob, setAvatarBlob] = useState<ExternalBlob | undefined>(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const blob = ExternalBlob.fromBytes(bytes);
    setAvatarBlob(blob);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    await saveProfile.mutateAsync({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatar: avatarBlob,
    });

    onSaved?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback className="text-2xl">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Change Avatar
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name *</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={saveProfile.isPending || !displayName.trim()}>
        {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </form>
  );
}
