"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./PropertyCard";
import { ListingMeta } from "./ListingMeta";
import { PropertyInfoGrid } from "./PropertyInfoGrid";
import { PricingSection } from "./PricingSection";
import { PolicySection } from "./PolicySection";
import { RulesSection } from "./RulesSection";
import { OwnerCard } from "./OwnerCard";
import { RentButton } from "./RentButton";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import {
  useTrackInteraction,
  useInteractionState,
} from "@/hooks/useInteractions";
import { usePropertyRentalStatus } from "@/hooks/useRentals";
import { useSession } from "@/hooks/useAuth";
import { Property } from "@/../../rentivo-server/src/types";
import { PropertyOwner } from "@/hooks/useProperties";
import { Heart } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
  owner?: PropertyOwner | null;
  relatedProperties?: Property[];
}

export const PropertyDetails = ({
  property,
  owner,
  relatedProperties = [],
}: PropertyDetailsProps) => {
  const { data: session } = useSession();
  const trackInteraction = useTrackInteraction();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const propertyId = property._id?.toString() || "";
  const { data: interactionStateData } = useInteractionState(propertyId);
  const [interactionState, setInteractionState] = useState<"idle" | "saved">(
    "idle"
  );
  const [isSaving, setIsSaving] = useState(false);
  const viewTrackedRef = useRef(false);

  const isOwner =
    !!session &&
    !!owner &&
    session.user.id === owner._id?.toString();
  const { data: rentalStatusData } = usePropertyRentalStatus(propertyId);
  const hasActiveRental =
    rentalStatusData?.isRented && rentalStatusData?.rental?.status === "active";
  const canReview = session && !isOwner && hasActiveRental;

  useEffect(() => {
    if (interactionStateData) {
      setInteractionState(
        interactionStateData.hasSaved ? "saved" : "idle"
      );
    }
  }, [interactionStateData]);

  useEffect(() => {
    if (session && property._id && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      trackInteraction.mutate({
        propertyId: property._id.toString(),
        type: "view",
      });
    }
  }, [property._id, session]);

  const handleSave = () => {
    if (!session || !property._id) return;
    setIsSaving(true);
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
        onSettled: () => {
          setIsSaving(false);
        },
      }
    );
  };

  const images = property.images;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Gallery + Description */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
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

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === currentImageIndex}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    i === currentImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <ListingMeta property={property} />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Price */}
          <div className="rounded-2xl border bg-card p-5">
            <div className="text-3xl font-bold text-foreground">
              ${property.price.toLocaleString()}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </div>
          </div>

          {/* Save + Rent buttons */}
          {session && (
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                variant="outline"
                className="flex-1 rounded-full"
                disabled={isSaving || interactionState === "saved"}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    interactionState === "saved" ? "fill-primary text-primary" : ""
                  }`}
                />
                {interactionState === "saved" ? "Saved" : "Save"}
              </Button>
            </div>
          )}

          {session && (
            <RentButton property={property} isOwner={isOwner} />
          )}

          {/* Info grid */}
          <PropertyInfoGrid property={property} />

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="mb-3 font-display text-sm font-bold">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <PricingSection property={property} />
          <PolicySection property={property} />
          <RulesSection property={property} />
          {owner && <OwnerCard owner={owner} />}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-8">
        <div>
          <h2 className="mb-4 font-display text-xl font-bold">Reviews</h2>
          <ReviewList propertyId={propertyId} />
        </div>

        {canReview && <ReviewForm propertyId={propertyId} />}
      </div>

      {/* Related properties */}
      {relatedProperties.length > 0 && (
        <div>
          <h2 className="mb-6 font-display text-xl font-bold">
            Similar Properties
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {relatedProperties.map((p) => (
              <PropertyCard key={p._id?.toString()} property={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
