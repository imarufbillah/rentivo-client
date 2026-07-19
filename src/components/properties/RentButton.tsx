"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Property } from "@/../../rentivo-server/src/types";
import { usePropertyRentalStatus } from "@/hooks/useRentals";
import { RentConfirmationDialog } from "./RentConfirmationDialog";
import { Home, Loader2 } from "lucide-react";

interface RentButtonProps {
  property: Property;
  isOwner: boolean;
}

export const RentButton = ({ property, isOwner }: RentButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const propertyId = property._id?.toString() || "";
  const { data: rentalStatus, isLoading } = usePropertyRentalStatus(propertyId);

  if (isOwner) return null;

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking availability...
      </Button>
    );
  }

  if (property.status === "rented" || rentalStatus?.isRented) {
    return (
      <Button disabled variant="outline" className="w-full">
        <Home className="mr-2 h-4 w-4" />
        Currently Rented
      </Button>
    );
  }

  return (
    <>
      <Button onClick={() => setShowDialog(true)} className="w-full" size="lg">
        <Home className="mr-2 h-4 w-4" />
        Rent This Property
      </Button>

      <RentConfirmationDialog
        property={property}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
};
