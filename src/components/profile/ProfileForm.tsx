"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarUpload } from "./AvatarUpload";
import { useUpdateProfile } from "@/hooks/useAuth";

interface ProfileFormProps {
  userName?: string;
  userAvatar?: string | null;
  userEmail?: string;
}

export const ProfileForm = ({
  userName,
  userAvatar,
  userEmail,
}: ProfileFormProps) => {
  const [name, setName] = useState(userName || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userAvatar || null);
  const updateProfile = useUpdateProfile();

  const hasChanges = name !== (userName || "") || avatarUrl !== (userAvatar || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    updateProfile.mutate(
      { name: name.trim(), image: avatarUrl || undefined },
      {
        onSuccess: () => {
          toast.success("Profile updated");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update profile");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6">
        <AvatarUpload
          currentAvatar={userAvatar}
          userName={userName}
          onAvatarChange={setAvatarUrl}
        />
        <div>
          <p className="font-medium">{userName || "Unnamed User"}</p>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Display Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email
          </label>
          <Input
            id="email"
            value={userEmail || ""}
            disabled
            className="opacity-60"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
      </div>

      <Button type="submit" disabled={!hasChanges || updateProfile.isPending}>
        {updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
