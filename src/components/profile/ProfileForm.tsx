"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import { useUpdateProfile } from "@/hooks/useAuth";
import { User, Mail, Loader2 } from "lucide-react";

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
          <p className="font-medium text-foreground">
            {userName || "Unnamed User"}
          </p>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              value={userEmail || ""}
              disabled
              className="w-full rounded-xl border bg-card py-2.5 pl-10 pr-3 text-sm opacity-60"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="rounded-full"
        disabled={!hasChanges || updateProfile.isPending}
      >
        {updateProfile.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {updateProfile.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
