"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";
import { AlertTriangle } from "lucide-react";

const EditPropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, error } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const handleSubmit = (
    formData: Parameters<typeof updateProperty.mutate>[0]["data"]
  ) => {
    updateProperty.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success("Property updated successfully");
          router.push("/properties/manage");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update property");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRole="owner">
          <div className="min-h-dvh mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 animate-pulse rounded-xl bg-muted"
                  />
                ))}
              </div>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  if (error || !data?.property) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRole="owner">
          <div className="min-h-dvh mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <p className="text-muted-foreground">
                {error?.message || "Property not found"}
              </p>
            </div>
          </div>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="owner">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold">Edit Property</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your property listing details
            </p>
          </div>

          <PropertyForm
            initialData={data.property}
            onSubmit={handleSubmit}
            isLoading={updateProperty.isPending}
          />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default EditPropertyPage;
