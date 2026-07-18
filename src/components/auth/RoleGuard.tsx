"use client";

import { useSession } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const user = session?.user;
  if (!user || user.role !== allowedRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">
          You need an {allowedRole} account to access this page.
        </p>
        <div className="flex gap-3">
          <Link href="/upgrade">
            <Button>Become an Owner</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
