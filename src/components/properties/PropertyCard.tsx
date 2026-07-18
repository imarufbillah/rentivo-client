"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useTrackInteraction } from "@/hooks/useInteractions";
import { useSession } from "@/hooks/useAuth";

interface PropertyCardProps {
  property: {
    _id?: string | { toString(): string };
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    images: string[];
    averageRating?: number | null;
    reviewCount?: number;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { data: session } = useSession();
  const trackInteraction = useTrackInteraction();
  const propertyId = property._id?.toString() || "";
  const [interactionState, setInteractionState] = useState<"idle" | "saved" | "dismissed">("idle");

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) return;
    trackInteraction.mutate(
      { propertyId, type: "save" },
      {
        onSuccess: () => {
          setInteractionState("saved");
          toast.success("Property saved");
        },
        onError: () => {
          toast.error("Failed to save property");
        },
      }
    );
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) return;
    trackInteraction.mutate(
      { propertyId, type: "dismiss" },
      {
        onSuccess: () => {
          setInteractionState("dismissed");
          toast.success("Property dismissed");
        },
        onError: () => {
          toast.error("Failed to dismiss property");
        },
      }
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-[400px] w-full overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/properties/${propertyId}`} className="block h-full">
        <div className="relative h-48 w-full overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge variant="secondary">{property.propertyType}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold">{property.title}</h3>
            <span className="whitespace-nowrap text-lg font-bold text-primary">
              ${property.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{property.location}</p>

          {property.averageRating != null && (
            <div className="flex items-center gap-1 text-sm" aria-label={`Rating: ${property.averageRating.toFixed(1)} out of 5 stars`}>
              <span className="text-warning" aria-hidden="true">★</span>
              <span className="font-medium">{property.averageRating.toFixed(1)}</span>
              {property.reviewCount != null && (
                <span className="text-muted-foreground">({property.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </Link>

      {session && (
        <div className="flex gap-2 px-4 pb-4">
          <button
            onClick={handleSave}
            disabled={trackInteraction.isPending || interactionState === "saved"}
            aria-label={`Save ${property.title}`}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              interactionState === "saved"
                ? "bg-green-100 text-green-700"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {interactionState === "saved" ? "Saved ✓" : "Save"}
          </button>
          <button
            onClick={handleDismiss}
            disabled={trackInteraction.isPending || interactionState === "dismissed"}
            aria-label={`Dismiss ${property.title}`}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
              interactionState === "dismissed"
                ? "bg-muted text-muted-foreground/70"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {interactionState === "dismissed" ? "Dismissed" : "Dismiss"}
          </button>
        </div>
      )}
    </motion.div>
  );
};
