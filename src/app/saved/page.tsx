"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useSavedProperties, useDeleteInteraction } from "@/hooks/useInteractions";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2, Heart, MapPin, BedDouble, Bath, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Property } from "@/types";

const SavedPropertyCard = ({ property }: { property: Property }) => {
  const deleteInteraction = useDeleteInteraction();
  const [isRemoving, setIsRemoving] = useState(false);
  const propertyId = property._id?.toString() || "";

  const handleUnsave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    deleteInteraction.mutate(
      { propertyId, type: "save" },
      {
        onSuccess: () => {
          toast.success("Removed from saved properties");
        },
        onError: () => {
          toast.error("Failed to remove property");
          setIsRemoving(false);
        },
      }
    );
  };

  if (isRemoving) return null;

  return (
    <Link href={`/properties/${propertyId}`} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
              No image
            </div>
          )}
          {/* Unsave button */}
          <button
            onClick={handleUnsave}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Remove ${property.title} from saved`}
            disabled={deleteInteraction.isPending}
          >
            {deleteInteraction.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className="h-4 w-4 fill-primary text-primary" />
            )}
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <span className="whitespace-nowrap text-base font-bold text-foreground">
              ${property.price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms} bath
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const SavedPropertiesPage = () => {
  const { data, isLoading, error } = useSavedProperties();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">Saved Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Properties you&apos;ve saved for later review.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Failed to load saved properties. Please try again later.
            </p>
          </div>
        ) : data?.properties && data.properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((property) => (
              <SavedPropertyCard key={property._id?.toString()} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">
              No saved properties yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start browsing properties and save the ones you like.
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button className="rounded-full">Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SavedPropertiesPage;
