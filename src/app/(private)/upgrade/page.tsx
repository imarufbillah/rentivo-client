"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpgradeToOwner } from "@/hooks/useAuth";
import { Home, Loader2, ArrowRight, Shield } from "lucide-react";

const UpgradePage = () => {
  const upgradeMutation = useUpgradeToOwner();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleUpgrade = () => {
    setError("");
    upgradeMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Welcome! You are now an owner.");
        setOpen(false);
      },
      onError: (err) => {
        setError(err.message || "Upgrade failed. Please try again.");
      },
    });
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="renter">
        <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
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

            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={() => setOpen(true)}
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Become an Owner
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Confirm Upgrade
                  </DialogTitle>
                  <DialogDescription>
                    You will be upgraded to an Owner account. This lets you create, edit, and manage
                    property listings. This action can be reversed later if needed.
                  </DialogDescription>
                </DialogHeader>
                {error && (
                  <div role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={upgradeMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpgrade} disabled={upgradeMutation.isPending}>
                    {upgradeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {upgradeMutation.isPending ? "Upgrading..." : "Confirm Upgrade"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default UpgradePage;
