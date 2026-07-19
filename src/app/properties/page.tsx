"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import {
  PropertyFilters,
  FilterState,
} from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { getErrorMessage } from "@/lib/api/error";
import { AlertCircle } from "lucide-react";

const defaultFilters: FilterState = {
  search: "",
  location: "",
  minPrice: "",
  maxPrice: "",
  propertyType: "",
  minBedrooms: "",
  maxBedrooms: "",
  minBathrooms: "",
  maxBathrooms: "",
  amenities: "",
  minRating: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const parseSearchParams = (searchParams: URLSearchParams): FilterState => ({
  search: searchParams.get("search") || "",
  location: searchParams.get("location") || "",
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  propertyType: searchParams.get("propertyType") || "",
  minBedrooms: searchParams.get("minBedrooms") || "",
  maxBedrooms: searchParams.get("maxBedrooms") || "",
  minBathrooms: searchParams.get("minBathrooms") || "",
  maxBathrooms: searchParams.get("maxBathrooms") || "",
  amenities: searchParams.get("amenities") || "",
  minRating: searchParams.get("minRating") || "",
  sortBy: searchParams.get("sortBy") || "createdAt",
  sortOrder: searchParams.get("sortOrder") || "desc",
});

const PropertiesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>(() =>
    parseSearchParams(searchParams)
  );

  useEffect(() => {
    setFilters(parseSearchParams(searchParams));
  }, [searchParams]);

  const { data, isLoading, error, refetch } = useProperties({
    search: filters.search || undefined,
    location: filters.location || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    propertyType: filters.propertyType || undefined,
    minBedrooms: filters.minBedrooms ? Number(filters.minBedrooms) : undefined,
    maxBedrooms: filters.maxBedrooms ? Number(filters.maxBedrooms) : undefined,
    minBathrooms: filters.minBathrooms
      ? Number(filters.minBathrooms)
      : undefined,
    maxBathrooms: filters.maxBathrooms
      ? Number(filters.maxBathrooms)
      : undefined,
    amenities: filters.amenities || undefined,
    minRating: filters.minRating ? Number(filters.minRating) : undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page,
    limit: 12,
  });

  const properties = (data?.data || []).map((p: any) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      setPage(1);

      const params = new URLSearchParams();
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.location) params.set("location", newFilters.location);
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.propertyType)
        params.set("propertyType", newFilters.propertyType);
      if (newFilters.minBedrooms)
        params.set("minBedrooms", newFilters.minBedrooms);
      if (newFilters.maxBedrooms)
        params.set("maxBedrooms", newFilters.maxBedrooms);
      if (newFilters.minBathrooms)
        params.set("minBathrooms", newFilters.minBathrooms);
      if (newFilters.maxBathrooms)
        params.set("maxBathrooms", newFilters.maxBathrooms);
      if (newFilters.amenities) params.set("amenities", newFilters.amenities);
      if (newFilters.minRating) params.set("minRating", newFilters.minRating);
      if (newFilters.sortBy && newFilters.sortBy !== "createdAt")
        params.set("sortBy", newFilters.sortBy);
      if (newFilters.sortOrder && newFilters.sortOrder !== "desc")
        params.set("sortOrder", newFilters.sortOrder);

      const qs = params.toString();
      router.push(`/properties${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPage));
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Find Your Perfect Property
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse available rental properties or use filters to narrow your
          search
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside>
          <PropertyFilters
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </aside>

        {/* Content */}
        <section>
          {error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">
                Failed to Load Properties
              </h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {getErrorMessage(error)}
              </p>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="mt-4 rounded-full"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <PropertyGrid properties={properties} isLoading={isLoading} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PropertiesPage;
