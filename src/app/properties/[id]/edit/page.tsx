"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { useProperty, useUpdateProperty } from "@/hooks/useProperties";

const EditPropertyPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data, isLoading, error } = useProperty(id);
  const updateProperty = useUpdateProperty();

  const handleSubmit = (formData: Parameters<typeof updateProperty.mutate>[0]["data"]) => {
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
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-6">
              <div className="h-8 w-48 animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-muted" />
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
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="rounded-xl border p-8 text-center">
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
            <h1 className="text-2xl font-bold">Edit Property</h1>
            <p className="mt-2 text-sm text-muted-foreground">
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
