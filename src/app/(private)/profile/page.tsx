"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useSession } from "@/hooks/useAuth";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

const ProfilePage = () => {
  const { data: session } = useSession();

  const user = session?.user as
    | { name?: string; image?: string; email?: string }
    | undefined;

  return (
    <ProtectedRoute>
      <div className="min-h-dvh mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AppBreadcrumb segments={[{ label: "Profile" }]} />
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <ProfileForm
            userName={user?.name}
            userAvatar={user?.image}
            userEmail={user?.email}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
