"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, Home, Loader2, AlertCircle } from "lucide-react";
import { useCancelPendingRental } from "@/hooks/useRentals";

const RentalCancelPage = ({ searchParams }: { searchParams: Promise<{ property_id?: string }> }) => {
  const { property_id } = use(searchParams);
  const cancelPending = useCancelPendingRental();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (property_id) {
      cancelPending.mutate(property_id, {
        onError: () => {
          setError("Failed to cancel the pending rental. No charges were made.");
        },
      });
    }
  }, [property_id]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Cancellation Issue</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
        </div>
        <div className="flex gap-3">
          {property_id ? (
            <Link href={`/properties/${property_id}`}>
              <Button className="rounded-full">
                <Home className="mr-2 h-4 w-4" />
                Back to Property
              </Button>
            </Link>
          ) : (
            <Link href="/properties">
              <Button className="rounded-full">
                <Home className="mr-2 h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        {cancelPending.isPending ? (
          <Loader2 className="h-12 w-12 text-destructive animate-spin" />
        ) : (
          <XCircle className="h-12 w-12 text-destructive" />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">
          {cancelPending.isPending ? "Cancelling..." : "Rental Cancelled"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {cancelPending.isPending
            ? "Processing your cancellation..."
            : "Your payment was not processed. No charges were made."}
        </p>
      </div>

      <div className="flex gap-3">
        {property_id ? (
          <Link href={`/properties/${property_id}`}>
            <Button className="rounded-full" disabled={cancelPending.isPending}>
              <Home className="mr-2 h-4 w-4" />
              Back to Property
            </Button>
          </Link>
        ) : (
          <Link href="/properties">
            <Button className="rounded-full" disabled={cancelPending.isPending}>
              <Home className="mr-2 h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RentalCancelPage;
