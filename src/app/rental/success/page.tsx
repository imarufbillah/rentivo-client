"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useConfirmRental } from "@/hooks/useRentals";

const RentalSuccessPage = ({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) => {
  const { session_id } = use(searchParams);
  const confirmRental = useConfirmRental();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) {
      setError("No checkout session found. Please try browsing properties again.");
      return;
    }

    if (!confirmed && !confirmRental.isPending && !error) {
      confirmRental.mutate(session_id, {
        onSuccess: (data) => {
          setConfirmed(data.confirmed);
        },
        onError: (err) => {
          setError(err.message || "Failed to confirm your rental. Please contact support.");
        },
      });
    }
  }, [session_id]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Something Went Wrong</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{error}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/properties">
            <Button variant="outline" className="rounded-full">
              <Home className="mr-2 h-4 w-4" />
              Browse Properties
            </Button>
          </Link>
          <Link href="/history">
            <Button className="rounded-full">
              View History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <Button variant="outline" className="rounded-full">
            <Home className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </Link>
        <Link href="/history">
          <Button disabled={confirmRental.isPending} className="rounded-full">
            View History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RentalSuccessPage;
