"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAmenities } from "@/hooks/useProperties";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface PropertyFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export interface FilterState {
  search: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  minBedrooms: string;
  maxBedrooms: string;
  minBathrooms: string;
  maxBathrooms: string;
  amenities: string;
  minRating: string;
  sortBy: string;
  sortOrder: string;
}

const propertyTypes = ["", "apartment", "house", "room", "studio", "villa"];

export const PropertyFilters = ({
  onFilterChange,
  initialFilters,
}: PropertyFiltersProps) => {
  const { data: amenitiesData } = useAmenities();
  const amenitiesList = (amenitiesData?.amenities || []).map((a) => ({
    value: a,
    label: a.charAt(0).toUpperCase() + a.slice(1),
  }));

  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || "",
    location: initialFilters?.location || "",
    minPrice: initialFilters?.minPrice || "",
    maxPrice: initialFilters?.maxPrice || "",
    propertyType: initialFilters?.propertyType || "",
    minBedrooms: initialFilters?.minBedrooms || "",
    maxBedrooms: initialFilters?.maxBedrooms || "",
    minBathrooms: initialFilters?.minBathrooms || "",
    maxBathrooms: initialFilters?.maxBathrooms || "",
    amenities: initialFilters?.amenities || "",
    minRating: initialFilters?.minRating || "",
    sortBy: initialFilters?.sortBy || "createdAt",
    sortOrder: initialFilters?.sortOrder || "desc",
  });

  const prevInitialRef = useRef(initialFilters);

  useEffect(() => {
    const prev = prevInitialRef.current;
    prevInitialRef.current = initialFilters;
    if (!initialFilters || prev === initialFilters) return;
    if (JSON.stringify(prev) === JSON.stringify(initialFilters)) return;
    setFilters((current) => {
      const next = { ...current };
      for (const [key, value] of Object.entries(initialFilters)) {
        if (value !== undefined) {
          (next as Record<string, string>)[key] = value;
        }
      }
      return next;
    });
  }, [initialFilters]);

  const debouncedOnChange = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (value: FilterState) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => onFilterChange(value), 300);
      };
    })(),
    [onFilterChange]
  );

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    debouncedOnChange(filters);
  }, [filters, debouncedOnChange]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const current = prev.amenities
        ? prev.amenities.split(",").filter(Boolean)
        : [];
      const next = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      return { ...prev, amenities: next.join(",") };
    });
  };

  const clearFilters = () => {
    const empty: FilterState = {
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
    setFilters(empty);
    onFilterChange(empty);
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.propertyType ||
    filters.minBedrooms ||
    filters.maxBedrooms ||
    filters.minBathrooms ||
    filters.maxBathrooms ||
    filters.amenities ||
    filters.minRating;

  return (
    <div className="space-y-5 rounded-2xl border bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-display text-sm font-bold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search properties..."
          className="rounded-xl pl-9"
        />
      </div>

      {/* Location + Type */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="Location"
          className="rounded-xl"
        />
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilter("propertyType", e.target.value)}
          className="rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type
                ? type.charAt(0).toUpperCase() + type.slice(1)
                : "All Types"}
            </option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          placeholder="Min price"
          className="rounded-xl"
        />
        <Input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          placeholder="Max price"
          className="rounded-xl"
        />
      </div>

      {/* Bedrooms */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minBedrooms}
          onChange={(e) => updateFilter("minBedrooms", e.target.value)}
          placeholder="Min beds"
          min="0"
          className="rounded-xl"
        />
        <Input
          type="number"
          value={filters.maxBedrooms}
          onChange={(e) => updateFilter("maxBedrooms", e.target.value)}
          placeholder="Max beds"
          min="0"
          className="rounded-xl"
        />
      </div>

      {/* Bathrooms */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minBathrooms}
          onChange={(e) => updateFilter("minBathrooms", e.target.value)}
          placeholder="Min baths"
          min="0"
          className="rounded-xl"
        />
        <Input
          type="number"
          value={filters.maxBathrooms}
          onChange={(e) => updateFilter("maxBathrooms", e.target.value)}
          placeholder="Max baths"
          min="0"
          className="rounded-xl"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Min Rating
        </label>
        <select
          value={filters.minRating}
          onChange={(e) => updateFilter("minRating", e.target.value)}
          className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5 only</option>
        </select>
      </div>

      {/* Amenities */}
      {amenitiesList.length > 0 && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => {
              const selected = filters.amenities
                ?.split(",")
                .includes(amenity.value);
              return (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() => toggleAmenity(amenity.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {amenity.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-3">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="flex-1 rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="bedrooms">Bedrooms</option>
        </select>
        <select
          value={filters.sortOrder}
          onChange={(e) => updateFilter("sortOrder", e.target.value)}
          className="w-24 rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
    </div>
  );
};
