"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { useProperty, useRelatedProperties } from "@/hooks/useProperties";

const PropertyDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useProperty(id);
  const property = data?.property;

  const { data: relatedData } = useRelatedProperties(
    property?.location || "",
    property?.propertyType || "",
    id
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-[400px] animate-pulse rounded-xl bg-muted" />
          <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold">Property not found</h2>
        <p className="text-muted-foreground">
          The property you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/properties")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  const relatedProperties = (relatedData || []).map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <PropertyDetails property={property} relatedProperties={relatedProperties as any} />
    </div>
  );
};

export default PropertyDetailPage;
