"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useSavedProperties } from "@/hooks/useInteractions";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2 } from "lucide-react";

const SavedPropertiesPage = () => {
  const { data, isLoading, error } = useSavedProperties();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">Saved Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Properties you&apos;ve saved for later review.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
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
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">
              No saved properties yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start browsing properties and save the ones you like.
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button className="rounded-full">Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default SavedPropertiesPage;
