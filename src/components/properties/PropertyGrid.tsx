"use client";

import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties: Array<{
    _id?: string;
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    images: string[];
    averageRating?: number | null;
    reviewCount?: number;
  }>;
  isLoading?: boolean;
}

const CardSkeleton = () => (
  <div className="h-[400px] w-full overflow-hidden rounded-xl border bg-card shadow-sm">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  </div>
);

export const PropertyGrid = ({ properties, isLoading }: PropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 text-4xl text-muted-foreground">🏠</div>
        <h3 className="text-lg font-semibold">No properties found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};
