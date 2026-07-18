"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { useUpgradeToOwner } from "@/hooks/useAuth";

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
            <div className="text-5xl">🏠</div>
            <h1 className="text-2xl font-bold">Become a Property Owner</h1>
            <p className="text-muted-foreground">
              Upgrade your account to list and manage rental properties on Rentivo.
              It&apos;s free and takes just one click.
            </p>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              onClick={handleUpgrade}
              disabled={upgradeMutation.isPending}
              size="lg"
              className="w-full"
            >
              {upgradeMutation.isPending ? "Upgrading..." : "Become an Owner"}
            </Button>

            <p className="text-xs text-muted-foreground">
              You can always switch back to a renter account later.
            </p>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default UpgradePage;
