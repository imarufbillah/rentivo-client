"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAmenities } from "@/hooks/useProperties";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
];

const ratingOptions = [
  { value: "all", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5 only" },
];

const sortOptions = [
  { value: "createdAt", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "bedrooms", label: "Bedrooms" },
  { value: "averageRating", label: "Top Rated" },
];

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
          <Tooltip>
            <TooltipTrigger render={<Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
            />}>
              <X className="mr-1 h-3 w-3" />
              Clear all
            </TooltipTrigger>
            <TooltipContent>Remove all active filters</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search properties..."
          aria-label="Search properties"
          className="rounded-xl pl-9"
        />
      </div>

      {/* Location + Type */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="filter-location" className="text-xs text-muted-foreground">
            Location
          </Label>
          <Input
            id="filter-location"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            placeholder="City, neighborhood..."
            className="mt-1 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Property Type</Label>
          <Select
            value={filters.propertyType || "all"}
            onValueChange={(v) => updateFilter("propertyType", !v || v === "all" ? "" : v)}
          >
            <SelectTrigger className="mt-1 rounded-xl" aria-label="Property type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price range */}
      <div>
        <Label className="text-xs text-muted-foreground">Price Range</Label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            placeholder="Min"
            aria-label="Minimum price"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            placeholder="Max"
            aria-label="Maximum price"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <Label className="text-xs text-muted-foreground">Bedrooms</Label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={filters.minBedrooms}
            onChange={(e) => updateFilter("minBedrooms", e.target.value)}
            placeholder="Min"
            aria-label="Minimum bedrooms"
            min="0"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.maxBedrooms}
            onChange={(e) => updateFilter("maxBedrooms", e.target.value)}
            placeholder="Max"
            aria-label="Maximum bedrooms"
            min="0"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <Label className="text-xs text-muted-foreground">Bathrooms</Label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={filters.minBathrooms}
            onChange={(e) => updateFilter("minBathrooms", e.target.value)}
            placeholder="Min"
            aria-label="Minimum bathrooms"
            min="0"
            className="rounded-xl"
          />
          <Input
            type="number"
            value={filters.maxBathrooms}
            onChange={(e) => updateFilter("maxBathrooms", e.target.value)}
            placeholder="Max"
            aria-label="Maximum bathrooms"
            min="0"
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <Label className="text-xs text-muted-foreground">Min Rating</Label>
        <Select
          value={filters.minRating || "all"}
          onValueChange={(v) => updateFilter("minRating", !v || v === "all" ? "" : v)}
        >
          <SelectTrigger className="mt-1 rounded-xl" aria-label="Minimum rating">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amenities — collapsible */}
      {amenitiesList.length > 0 && (
        <Accordion defaultValue={[]}>
          <AccordionItem value="amenities" className="border-none">
            <AccordionTrigger className="py-1 text-xs text-muted-foreground hover:no-underline">
              Amenities
              {filters.amenities && (
                <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {filters.amenities.split(",").filter(Boolean).length}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-1">
                {amenitiesList.map((amenity) => {
                  const selected = filters.amenities
                    ?.split(",")
                    .includes(amenity.value);
                  return (
                    <button
                      key={amenity.value}
                      type="button"
                      onClick={() => toggleAmenity(amenity.value)}
                      aria-pressed={selected}
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Sort */}
      <div>
        <Label className="text-xs text-muted-foreground">Sort By</Label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(v) => updateFilter("sortBy", v || "createdAt")}
          >
            <SelectTrigger className="rounded-xl" aria-label="Sort by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.sortOrder}
            onValueChange={(v) => updateFilter("sortOrder", v || "desc")}
          >
            <SelectTrigger className="rounded-xl" aria-label="Sort order">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
