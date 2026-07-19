"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Property } from "@/../../rentivo-server/src/types";
import { useCreateCheckout } from "@/hooks/useRentals";
import { Loader2, CreditCard, Shield, Calendar, DollarSign } from "lucide-react";

interface RentConfirmationDialogProps {
  property: Property;
  open: boolean;
  onClose: () => void;
}

export const RentConfirmationDialog = ({
  property,
  open,
  onClose,
}: RentConfirmationDialogProps) => {
  const [agreed, setAgreed] = useState(false);
  const createCheckout = useCreateCheckout();

  if (!open) return null;

  const monthlyRent = property.price;
  const securityDeposit = property.securityDeposit || 0;
  const advancePayment = property.advancePayment || 0;
  const total = monthlyRent + securityDeposit + advancePayment;

  const handleConfirm = () => {
    createCheckout.mutate(property._id?.toString() || "", {
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
        <h2 className="text-xl font-bold">Confirm Rental</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You are about to rent <span className="font-medium">{property.title}</span>
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              First Month Rent
            </div>
            <span className="font-medium">${monthlyRent.toLocaleString()}</span>
          </div>

          {securityDeposit > 0 && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Security Deposit
              </div>
              <span className="font-medium">${securityDeposit.toLocaleString()}</span>
            </div>
          )}

          {advancePayment > 0 && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Advance Payment
              </div>
              <span className="font-medium">${advancePayment.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <span className="font-semibold">Total Due Today</span>
            <span className="text-lg font-bold text-primary">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>

        {property.leaseDuration && (
          <p className="mt-3 text-xs text-muted-foreground">
            Lease duration: {property.leaseDuration} months
            {property.minStay ? ` (minimum ${property.minStay} months)` : ""}
          </p>
        )}

        <div className="mt-4 flex items-start gap-2">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          <label htmlFor="agree-terms" className="text-xs text-muted-foreground">
            I agree to the rental terms and understand that the security deposit is
            refundable at the end of the lease subject to property inspection.
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!agreed || createCheckout.isPending}
            className="flex-1"
          >
            {createCheckout.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            {createCheckout.isPending ? "Processing..." : "Confirm & Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
};
