"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { PropertyDetailSkeleton } from "@/components/properties/PropertyDetailSkeleton";
import { useProperty, useRelatedProperties } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const PropertyDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useProperty(id);
  const property = data?.property;
  const owner = data?.owner;

  const { data: relatedData } = useRelatedProperties(
    property?.location || "",
    property?.propertyType || "",
    id
  );

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <PropertyDetailSkeleton />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="font-display text-xl font-bold">Property not found</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          The property you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button
          onClick={() => router.push("/properties")}
          className="rounded-full"
        >
          Browse Properties
        </Button>
      </div>
    );
  }

  const relatedProperties = (relatedData || []).map((p: any) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <PropertyDetails
      property={property}
      owner={owner}
      relatedProperties={relatedProperties as any}
    />
  );
};

export default PropertyDetailPage;
