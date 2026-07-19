"use client";

import { useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const RoleGuard = ({
  children,
  allowedRole = "owner",
}: {
  children: React.ReactNode;
  allowedRole?: "owner" | "renter";
}) => {
  const { data: session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const user = session?.user as Record<string, unknown> | undefined;
  if (!user || user.role !== allowedRole) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold">Access Denied</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need an {allowedRole} account to access this page.
        </p>
        <div className="flex gap-3">
          <Link href="/upgrade">
            <Button className="rounded-full">Become an Owner</Button>
          </Link>
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
