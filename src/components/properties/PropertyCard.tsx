"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useTrackInteraction, useInteractionState } from "@/hooks/useInteractions";
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
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    averageRating?: number | null;
    reviewCount?: number;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { data: session } = useSession();
  const trackInteraction = useTrackInteraction();
  const propertyId = property._id?.toString() || "";
  const { data: interactionStateData } = useInteractionState(propertyId);
  const [interactionState, setInteractionState] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    if (interactionStateData) {
      if (interactionStateData.hasSaved) {
        setInteractionState("saved");
      } else {
        setInteractionState("idle");
      }
    }
  }, [interactionStateData]);

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

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {property.bedrooms != null && (
              <span>{property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}</span>
            )}
            {property.bathrooms != null && (
              <span>{property.bathrooms} bath</span>
            )}
          </div>

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
        </div>
      )}
    </motion.div>
  );
};
