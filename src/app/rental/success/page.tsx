"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

const RentalSuccessPage = ({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) => {
  const { session_id } = use(searchParams);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="rounded-full bg-success/10 p-4">
        <CheckCircle className="h-12 w-12 text-success" />
      </div>

      <div>
        <h1 className="text-2xl font-bold">Rental Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Your payment has been processed successfully. You are now a tenant!
        </p>
        {session_id && (
          <p className="mt-1 text-xs text-muted-foreground/70">
            Session: {session_id.slice(0, 20)}...
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link href="/properties">
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Browse Properties
          </Button>
        </Link>
        <Link href="/history">
          <Button>
            View History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RentalSuccessPage;
