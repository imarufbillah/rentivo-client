"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "./PropertyCard";
import { BookingCard } from "./BookingCard";
import { ListingMeta } from "./ListingMeta";
import { PropertyInfoGrid } from "./PropertyInfoGrid";
import { PricingSection } from "./PricingSection";
import { PolicySection } from "./PolicySection";
import { RulesSection } from "./RulesSection";
import { OwnerCard } from "./OwnerCard";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import {
  useTrackInteraction,
  useInteractionState,
  useDeleteInteraction,
} from "@/hooks/useInteractions";
import { usePropertyRentalStatus } from "@/hooks/useRentals";
import { useSession } from "@/hooks/useAuth";
import { Property } from "@/types";
import { PropertyOwner } from "@/hooks/useProperties";
import { ChevronLeft, ChevronRight, Heart, LogIn } from "lucide-react";

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
  const deleteInteraction = useDeleteInteraction();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const propertyId = property._id?.toString() || "";
  const { data: interactionStateData } = useInteractionState(propertyId);
  const [interactionState, setInteractionState] = useState<"idle" | "saved">(
    "idle"
  );
  const [isSaving, setIsSaving] = useState(false);
  const viewTrackedRef = useRef(false);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  const handleSaveToggle = () => {
    if (!session || !property._id) return;

    if (interactionState === "saved") {
      setIsSaving(true);
      deleteInteraction.mutate(
        { propertyId: property._id.toString(), type: "save" },
        {
          onSuccess: () => {
            setInteractionState("idle");
            toast.success("Property removed from saved");
          },
          onError: () => {
            toast.error("Failed to remove property. Please try again.");
          },
          onSettled: () => {
            setIsSaving(false);
          },
        }
      );
    } else {
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
    }
  };

  const images = property.images;

  const goToPrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/properties" className="hover:text-foreground transition-colors">
              Properties
            </Link>
          </li>
          {property.location && (
            <>
              <li aria-hidden="true">/</li>
              <li className="truncate max-w-[150px]">{property.location}</li>
            </>
          )}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Gallery + Description */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main image with gallery nav */}
          <div
            ref={galleryRef}
            className="relative aspect-video w-full overflow-hidden rounded-2xl"
            tabIndex={0}
            role="group"
            aria-label="Property image gallery"
          >
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

            {/* Gallery nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                {/* Image counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
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

        {/* Right: Sidebar — uses shared BookingCard */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <BookingCard
            property={property}
            isSaved={interactionState === "saved"}
            isOwner={isOwner}
            isAuthenticated={!!session}
            isSaving={isSaving}
            onSaveToggle={handleSaveToggle}
          />

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
            {relatedProperties.map((p: any) => (
              <PropertyCard key={p._id?.toString()} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile bottom booking bar */}
      {!isOwner && (
        <div className="fixed inset-x-0 bottom-0 z-modal border-t bg-card/95 backdrop-blur-sm lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <span className="text-xl font-bold text-foreground">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                /{property.rentFrequency === "weekly" ? "wk" : property.rentFrequency === "daily" ? "day" : "mo"}
              </span>
            </div>
            <div className="flex gap-2">
              {!session ? (
                <Link href={`/login?callbackUrl=${encodeURIComponent(`/properties/${propertyId}`)}`}>
                  <Button size="lg" className="rounded-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in to rent
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSaveToggle}
                    className="rounded-full"
                    disabled={isSaving}
                    aria-label={interactionState === "saved" ? "Remove from saved" : "Save property"}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        interactionState === "saved" ? "fill-primary text-primary" : ""
                      }`}
                    />
                  </Button>
                  <Link href="#booking">
                    <Button size="lg" className="rounded-full">
                      Rent Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
