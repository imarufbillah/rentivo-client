"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Heart, LogIn, Loader2, Key } from "lucide-react";
import { Property } from "@/types";
import { RentConfirmationDialog } from "@/components/properties/RentConfirmationDialog";
import { useState } from "react";

interface BookingCardProps {
  property: Property;
  isSaved: boolean;
  isOwner: boolean;
  isAuthenticated: boolean;
  isSaving: boolean;
  onSaveToggle: () => void;
}

export const BookingCard = ({
  property,
  isSaved,
  isOwner,
  isAuthenticated,
  isSaving,
  onSaveToggle,
}: BookingCardProps) => {
  const [showRentDialog, setShowRentDialog] = useState(false);

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      {/* Price */}
      <div className="text-3xl font-bold text-foreground">
        ${property.price.toLocaleString()}
        <span className="text-base font-normal text-muted-foreground">/mo</span>
      </div>

      {/* Save + Rent buttons — authenticated */}
      {isAuthenticated && (
        <div className="mt-4 flex gap-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  onClick={onSaveToggle}
                  variant="outline"
                  className="flex-1 rounded-full"
                  disabled={isSaving}
                />
              }
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  isSaved ? "fill-primary text-primary" : ""
                }`}
              />
              {isSaved ? "Saved" : "Save"}
            </TooltipTrigger>
            <TooltipContent>
              {isSaved ? "Remove from saved" : "Save to favorites"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Guest CTAs */}
      {!isAuthenticated && (
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(
              `/properties/${property._id?.toString()}`
            )}`}
          >
            <Button variant="outline" className="w-full rounded-full">
              <Heart className="mr-2 h-4 w-4" />
              Sign in to save
            </Button>
          </Link>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(
              `/properties/${property._id?.toString()}`
            )}`}
          >
            <Button className="w-full rounded-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in to rent
            </Button>
          </Link>
        </div>
      )}

      {/* Rent button — authenticated, not owner */}
      {isAuthenticated && !isOwner && property.status !== "rented" && (
        <div className="mt-3">
          <Button
            onClick={() => setShowRentDialog(true)}
            className="w-full rounded-full"
            size="lg"
          >
            <Key className="mr-2 h-4 w-4" />
            Rent This Property
          </Button>
        </div>
      )}

      {/* Already rented */}
      {isAuthenticated && !isOwner && property.status === "rented" && (
        <div className="mt-3">
          <Button
            disabled
            variant="outline"
            className="w-full rounded-full opacity-60"
          >
            <Key className="mr-2 h-4 w-4" />
            Currently Rented
          </Button>
        </div>
      )}

      {/* Trust bullets */}
      <div className="mt-4 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-success" />
          <span>Free cancellation before move-in</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-success" />
          <span>Secure payment via Stripe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-success" />
          <span>Direct from property owner</span>
        </div>
      </div>

      <RentConfirmationDialog
        property={property}
        open={showRentDialog}
        onClose={() => setShowRentDialog(false)}
      />
    </div>
  );
};
