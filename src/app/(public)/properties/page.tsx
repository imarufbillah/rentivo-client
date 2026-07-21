"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import {
  PropertyFilters,
  FilterState,
} from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useProperties } from "@/hooks/useProperties";
import { getErrorMessage } from "@/lib/api/error";
import { AlertCircle, SlidersHorizontal, X } from "lucide-react";

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

interface FilterChip {
  key: string;
  label: string;
  amenityKey?: string;
}

const filterChips = (filters: FilterState): FilterChip[] => {
  const chips: FilterChip[] = [];
  if (filters.location) chips.push({ key: "location", label: filters.location });
  if (filters.propertyType) chips.push({ key: "propertyType", label: filters.propertyType });
  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice || "0";
    const max = filters.maxPrice || "∞";
    chips.push({ key: "price", label: `$${min} - $${max}` });
  }
  if (filters.minBedrooms) chips.push({ key: "minBedrooms", label: `${filters.minBedrooms}+ beds` });
  if (filters.maxBedrooms) chips.push({ key: "maxBedrooms", label: `≤${filters.maxBedrooms} beds` });
  if (filters.minRating) chips.push({ key: "minRating", label: `${filters.minRating}+ stars` });
  if (filters.amenities) {
    filters.amenities.split(",").filter(Boolean).forEach((a) => {
      chips.push({ key: `amenity-${a}`, label: a, amenityKey: a });
    });
  }
  return chips;
};

const PropertiesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
  const totalResults = pagination?.total || 0;

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

  const handleRemoveChip = useCallback(
    (chip: { key: string; label: string; amenityKey?: string }) => {
      const newFilters = { ...filters };
      if (chip.amenityKey) {
        const amenities = filters.amenities.split(",").filter(Boolean);
        newFilters.amenities = amenities.filter((a) => a !== chip.amenityKey).join(",");
      } else {
        (newFilters as Record<string, string>)[chip.key] = "";
      }
      handleFilterChange(newFilters);
    },
    [filters, handleFilterChange]
  );

  const handleClearAll = useCallback(() => {
    handleFilterChange(defaultFilters);
  }, [handleFilterChange]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const params = new URLSearchParams(searchParams);
      params.set("page", String(newPage));
      router.push(`/properties?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const chips = filterChips(filters);
  const hasActiveFilters = chips.length > 0 || filters.search;

  return (
    <div className="min-h-dvh mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Find Your Perfect Property
        </h1>
        {totalResults > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? "property" : "properties"} found
          </p>
        )}
      </div>

      {/* Mobile filter toggle + active chips */}
      <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="rounded-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {chips.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {chips.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Desktop active filter chips */}
      {hasActiveFilters && (
        <div className="mb-4 hidden flex-wrap items-center gap-2 lg:flex">
          {chips.map((chip) => (
            <Badge
              key={chip.key + (chip.amenityKey || "")}
              variant="secondary"
              className="gap-1 rounded-full pr-1"
            >
              {chip.label}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => handleRemoveChip(chip)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      aria-label={`Remove ${chip.label} filter`}
                    />
                  }
                >
                  <X className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>Remove filter</TooltipContent>
              </Tooltip>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 rounded-full text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar — desktop always, mobile conditional */}
        <aside className={`${mobileFiltersOpen ? "block" : "hidden"} lg:block lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto scrollbar-hidden`}>
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
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => handlePageChange(Math.max(1, page - 1))}
                      disabled={page <= 1}
                      className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  }
                >
                  Previous
                </TooltipTrigger>
                <TooltipContent>Previous page</TooltipContent>
              </Tooltip>

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

              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                      disabled={page >= totalPages}
                      className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  }
                >
                  Next
                </TooltipTrigger>
                <TooltipContent>Next page</TooltipContent>
              </Tooltip>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PropertiesPage;
