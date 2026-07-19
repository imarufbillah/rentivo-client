"use client";

import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";

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
  <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-lg" />
      </div>
      <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-full rounded-lg" />
      <div className="mt-3 flex gap-4 border-t pt-3">
        <Skeleton className="h-3.5 w-12 rounded-lg" />
        <Skeleton className="h-3.5 w-12 rounded-lg" />
      </div>
    </div>
  </div>
);

export const PropertyGrid = ({ properties, isLoading }: PropertyGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Home className="h-8 w-8" />
        </div>
        <h3 className="mt-4 font-display text-lg font-bold">No properties found</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try adjusting your filters or search terms to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};
