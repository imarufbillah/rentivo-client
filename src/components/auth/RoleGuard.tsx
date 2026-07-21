"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export const RoleGuard = ({
  children,
  allowedRole = "owner",
}: {
  children: React.ReactNode;
  allowedRole?: "owner" | "renter";
}) => {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const isLoading = sessionLoading || userLoading;

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" aria-busy="true">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  if (!user || user.role !== allowedRole) {
    const isOwnerRequired = allowedRole === "owner";

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold">Access Denied</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isOwnerRequired
            ? "You need an owner account to access this page."
            : "This page is only available to renters."}
        </p>
        <div className="flex gap-3">
          {isOwnerRequired && user?.role === "renter" ? (
            <Link href="/upgrade">
              <Button className="rounded-full">
                Become an Owner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/properties">
              <Button className="rounded-full">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
