"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, X, GripVertical, Loader2 } from "lucide-react";
import { uploadToImgbb } from "@/lib/imgbb";

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  minImages?: number;
}

interface ImageCard {
  url: string;
  isUploading: boolean;
  localPreview?: string;
}

export const ImageManager = ({
  images,
  onChange,
  maxImages = 6,
  minImages = 1,
}: ImageManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cards, setCards] = useState<ImageCard[]>(
    images.map((url) => ({ url, isUploading: false }))
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const updateCards = (newCards: ImageCard[]) => {
    setCards(newCards);
    onChange(newCards.filter((c) => c.url && !c.isUploading).map((c) => c.url));
  };

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

    if (cards.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    const newCard: ImageCard = { url: "", isUploading: true, localPreview };
    const newCards = [...cards, newCard];
    setCards(newCards);

    try {
      const url = await uploadToImgbb(file);
      const updatedCards = newCards.map((c) =>
        c === newCard ? { ...c, url, isUploading: false, localPreview: undefined } : c
      );
      updateCards(updatedCards);
      toast.success("Image uploaded");
    } catch {
      const filteredCards = newCards.filter((c) => c !== newCard);
      updateCards(filteredCards);
      toast.error("Failed to upload image");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    if (cards.length <= minImages) {
      toast.error(`At least ${minImages} image is required`);
      return;
    }
    const newCards = cards.filter((_, i) => i !== index);
    updateCards(newCards);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newCards = [...cards];
    const [dragged] = newCards.splice(draggedIndex, 1);
    newCards.splice(index, 0, dragged);
    setDraggedIndex(index);
    updateCards(newCards);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((card, index) => (
          <div
            key={`${card.url}-${index}`}
            draggable={!card.isUploading}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group aspect-square rounded-lg border border-border overflow-hidden bg-muted ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            <Image
              src={card.localPreview || card.url}
              alt={`Property image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />

            {card.isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}

            {!card.isUploading && (
              <>
                <div className="absolute top-1 left-1 p-1 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </>
            )}
          </div>
        ))}

        {cards.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm">Add Image</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload property image"
      />

      <p className="text-xs text-muted-foreground">
        {cards.length}/{maxImages} images. Drag to reorder. Click × to remove.
      </p>
    </div>
  );
};
