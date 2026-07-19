"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Property } from "@/../../rentivo-server/src/types";
import { RentConfirmationDialog } from "./RentConfirmationDialog";
import { Home } from "lucide-react";

interface RentButtonProps {
  property: Property;
  isOwner: boolean;
}

export const RentButton = ({ property, isOwner }: RentButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);

  if (isOwner) return null;

  if (property.status === "rented") {
    return (
      <Button
        disabled
        variant="outline"
        className="w-full rounded-full opacity-60"
      >
        <Home className="mr-2 h-4 w-4" />
        Currently Rented
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="w-full rounded-full"
        size="lg"
      >
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
