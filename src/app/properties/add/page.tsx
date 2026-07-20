"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { useCreateProperty } from "@/hooks/useProperties";

const AddPropertyPage = () => {
  const router = useRouter();
  const createProperty = useCreateProperty();

  const handleSubmit = (
    data: Parameters<typeof createProperty.mutate>[0]
  ) => {
    createProperty.mutate(data, {
      onSuccess: () => {
        router.push("/properties/manage");
      },
    });
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRole="owner">
        <div className="min-h-dvh mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details to create a new property listing
            </p>
          </div>

          <PropertyForm
            onSubmit={handleSubmit}
            isLoading={createProperty.isPending}
          />
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default AddPropertyPage;
