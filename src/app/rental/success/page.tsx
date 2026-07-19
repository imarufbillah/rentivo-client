"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ArrowRight, Loader2 } from "lucide-react";
import { useConfirmRental } from "@/hooks/useRentals";

const RentalSuccessPage = ({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) => {
  const { session_id } = use(searchParams);
  const confirmRental = useConfirmRental();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (session_id && !confirmed && !confirmRental.isPending) {
      confirmRental.mutate(session_id, {
        onSuccess: (data) => {
          setConfirmed(data.confirmed);
        },
      });
    }
  }, [session_id]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-full bg-success/10 p-4">
        {confirmRental.isPending ? (
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
        ) : (
          <CheckCircle className="h-12 w-12 text-success" />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">
          {confirmRental.isPending ? "Confirming Payment..." : "Rental Confirmed!"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {confirmRental.isPending
            ? "Verifying your payment with Stripe..."
            : "Your payment has been processed successfully. You are now a tenant!"}
        </p>
      </div>

      <div className="flex gap-3">
        <Link href="/properties">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </Link>
        <Link href="/history">
          <Button disabled={confirmRental.isPending}>
            View History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RentalSuccessPage;
