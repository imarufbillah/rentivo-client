"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./PropertyCard";
import { useTrackInteraction } from "@/hooks/useInteractions";
import { useSession } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { Property } from "@/../../rentivo-server/src/types";

interface PropertyDetailsProps {
  property: Property;
  relatedProperties?: Property[];
}

export const PropertyDetails = ({ property, relatedProperties = [] }: PropertyDetailsProps) => {
  const { data: session } = useSession();
  const trackInteraction = useTrackInteraction();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: reviewData } = useReviews(property._id?.toString() || "");
  const [interactionState, setInteractionState] = useState<"idle" | "saved" | "dismissed">("idle");

  useEffect(() => {
    if (session && property._id) {
      trackInteraction.mutate({
        propertyId: property._id.toString(),
        type: "view",
      });
    }
  }, [property._id, session]);

  const handleSave = () => {
    if (!session || !property._id) return;
    trackInteraction.mutate(
      { propertyId: property._id.toString(), type: "save" },
      {
        onSuccess: () => {
          setInteractionState("saved");
          toast.success("Property saved to your favorites");
        },
        onError: () => {
          toast.error("Failed to save property. Please try again.");
        },
      }
    );
  };

  const handleDismiss = () => {
    if (!session || !property._id) return;
    trackInteraction.mutate(
      { propertyId: property._id.toString(), type: "dismiss" },
      {
        onSuccess: () => {
          setInteractionState("dismissed");
          toast.success("Property dismissed");
        },
        onError: () => {
          toast.error("Failed to dismiss property. Please try again.");
        },
      }
    );
  };

  const images = property.images;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            {images.length > 0 ? (
              <Image
                src={images[currentImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                No images available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === currentImageIndex}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="96px" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{property.propertyType}</Badge>
              <Badge variant="outline">{property.status}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold">{property.title}</h1>
            <p className="mt-1 text-muted-foreground">{property.location}</p>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-3xl font-bold text-primary">
              ${property.price.toLocaleString()}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </div>
          </div>

          {reviewData && (
            <div className="rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg text-warning">★</span>
                <span className="text-lg font-semibold">
                  {reviewData.averageRating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({reviewData.totalReviews} reviews)
                </span>
              </div>
            </div>
          )}

          {session && (
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={trackInteraction.isPending || interactionState === "saved"}
              >
                {interactionState === "saved" ? "Saved ✓" : "Save Property"}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1"
                disabled={trackInteraction.isPending || interactionState === "dismissed"}
              >
                {interactionState === "dismissed" ? "Dismissed" : "Dismiss"}
              </Button>
            </div>
          )}

          <div>
            <h2 className="mb-2 font-semibold">About this property</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {property.description}
            </p>
          </div>
        </div>
      </div>

      {relatedProperties.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Similar Properties</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedProperties.map((p) => (
              <PropertyCard key={p._id?.toString()} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
