"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useSavedProperties } from "@/hooks/useInteractions";
import { Button } from "@/components/ui/button";

const SavedPropertiesPage = () => {
  const { data, isLoading, error } = useSavedProperties();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Saved Properties</h1>
          <p className="mt-2 text-muted-foreground">
            Properties you&apos;ve saved for later review.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="text-muted-foreground">
              Failed to load saved properties. Please try again later.
            </p>
          </div>
        ) : data?.properties && data.properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.properties.map((property) => (
              <PropertyCard key={property._id?.toString()} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border p-12 text-center">
            <h2 className="text-xl font-semibold">No saved properties yet</h2>
            <p className="mt-2 text-muted-foreground">
              Start browsing properties and save the ones you like.
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SavedPropertiesPage;
