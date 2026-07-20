"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { useFeaturedProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star } from "lucide-react";

export const FeaturedProperties = () => {
  const { data: properties, isLoading } = useFeaturedProperties();

  if (isLoading) {
    return (
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <Skeleton className="mx-auto mb-3 h-6 w-48 rounded-full" />
            <Skeleton className="mx-auto h-4 w-80 rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4 rounded-full" />
                  <Skeleton className="h-4 w-1/2 rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!properties || properties.length === 0) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Star className="h-4 w-4" />
            Top Rated
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Hand-picked listings with the highest ratings from our community
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((property) => (
            <PropertyCard key={property._id?.toString()} property={property} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/properties">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
