"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { uploadToImgbb } from "@/lib/imgbb";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  userName?: string;
  onAvatarChange: (url: string) => void;
}

export const AvatarUpload = ({
  currentAvatar,
  userName,
  onAvatarChange,
}: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setIsUploading(true);
    try {
      const url = await uploadToImgbb(file);
      onAvatarChange(url);
      toast.success("Avatar uploaded");
    } catch {
      toast.error("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = preview || currentAvatar;
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border hover:border-primary transition-colors"
        aria-label="Change avatar"
      >
        {displayImage ? (
          <Image
            src={displayImage}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-semibold text-muted-foreground">
            {initials}
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload avatar"
      />
    </div>
  );
};
