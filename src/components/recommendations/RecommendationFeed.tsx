"use client";

import { useState } from "react";
import { RecommendationCard } from "./RecommendationCard";
import { PropertyFilters, FilterState } from "@/components/properties/PropertyFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendations } from "@/hooks/useRecommendations";

export const RecommendationFeed = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useRecommendations({
    location: filters.location || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    propertyType: filters.propertyType || undefined,
  });

  const recommendations = data?.recommendations || [];
  const isPersonalized = data?.isPersonalized ?? true;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {isPersonalized ? "Recommended for You" : "Popular Properties"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPersonalized
            ? "Personalized picks based on your browsing history"
            : "Discover properties popular with other renters"}
        </p>
      </div>

      <PropertyFilters onFilterChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[440px] overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-sm">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border py-12 text-center">
          <div className="mb-4 text-4xl text-muted-foreground">🔍</div>
          <h3 className="text-lg font-semibold">No recommendations yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isPersonalized
              ? "Try adjusting your filters to find more properties"
              : "Browse properties to get personalized recommendations"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.property._id?.toString()}
              property={rec.property}
              explanation={rec.explanation}
              score={rec.score}
            />
          ))}
        </div>
      )}
    </div>
  );
};
