"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, Home } from "lucide-react";
import { useCancelPendingRental } from "@/hooks/useRentals";

const RentalCancelPage = ({ searchParams }: { searchParams: Promise<{ property_id?: string }> }) => {
  const { property_id } = use(searchParams);
  const cancelPending = useCancelPendingRental();

  useEffect(() => {
    if (property_id) {
      cancelPending.mutate(property_id);
    }
  }, [property_id]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <XCircle className="h-12 w-12 text-destructive" />
      </div>

      <div>
        <h1 className="text-2xl font-bold">Rental Cancelled</h1>
        <p className="mt-2 text-muted-foreground">
          Your payment was not processed. No charges were made.
        </p>
      </div>

      <div className="flex gap-3">
        {property_id ? (
          <Link href={`/properties/${property_id}`}>
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to Property
            </Button>
          </Link>
        ) : (
          <Link href="/properties">
            <Button>
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
