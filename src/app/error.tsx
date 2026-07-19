"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <p className="text-8xl font-bold text-destructive/20">!</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            onClick={reset}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => (window.location.href = "/")}
          >
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
