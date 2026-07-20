"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { useUpgradeToOwner } from "@/hooks/useAuth";
import { Home, Loader2, ArrowRight } from "lucide-react";

const UpgradePage = () => {
  const upgradeMutation = useUpgradeToOwner();
  const [error, setError] = useState("");

  const handleUpgrade = () => {
    setError("");
    upgradeMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Welcome! You are now an owner. Please sign in again.");
      },
      onError: (err) => {
        setError(err.message || "Upgrade failed. Please try again.");
      },
    });
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="renter">
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md space-y-6">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Home className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Become a Property Owner</h1>
            <p className="text-muted-foreground">
              Upgrade your account to list and manage rental properties on Rentivo.
              It&apos;s free and takes just one click.
            </p>

            {error && (
              <div role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleUpgrade}
              disabled={upgradeMutation.isPending}
              size="lg"
              className="w-full rounded-full"
            >
              {upgradeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {upgradeMutation.isPending ? "Upgrading..." : "Become an Owner"}
            </Button>

            <p className="text-xs text-muted-foreground">
              You will be signed out and asked to log back in with your new owner account.
            </p>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default UpgradePage;
