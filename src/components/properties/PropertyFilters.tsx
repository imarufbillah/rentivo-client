"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const amenitiesList = [
  { value: "wifi", label: "WiFi" },
  { value: "kitchen", label: "Kitchen" },
  { value: "parking", label: "Parking" },
  { value: "pool", label: "Pool" },
  { value: "gym", label: "Gym" },
  { value: "laundry", label: "Laundry" },
  { value: "washer/dryer", label: "Washer/Dryer" },
  { value: "ac", label: "AC" },
  { value: "pets", label: "Pets Allowed" },
  { value: "doorman", label: "Doorman" },
  { value: "elevator", label: "Elevator" },
  { value: "balcony", label: "Balcony" },
  { value: "patio", label: "Patio" },
  { value: "garden", label: "Garden" },
  { value: "garage", label: "Garage" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "hardwood", label: "Hardwood" },
  { value: "fireplace", label: "Fireplace" },
  { value: "storage", label: "Storage" },
  { value: "bike", label: "Bike Storage" },
  { value: "furnished", label: "Furnished" },
  { value: "views", label: "Views" },
];

export const PropertyFilters = ({ onFilterChange, initialFilters }: PropertyFiltersProps) => {
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
      const current = prev.amenities ? prev.amenities.split(",").filter(Boolean) : [];
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
    <div className="space-y-4 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <Input
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
        placeholder="Search properties..."
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="Location"
        />
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilter("propertyType", e.target.value)}
          className="rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type ? type.charAt(0).toUpperCase() + type.slice(1) : "All Types"}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          placeholder="Min price"
        />
        <Input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          placeholder="Max price"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minBedrooms}
          onChange={(e) => updateFilter("minBedrooms", e.target.value)}
          placeholder="Min beds"
          min="0"
        />
        <Input
          type="number"
          value={filters.maxBedrooms}
          onChange={(e) => updateFilter("maxBedrooms", e.target.value)}
          placeholder="Max beds"
          min="0"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={filters.minBathrooms}
          onChange={(e) => updateFilter("minBathrooms", e.target.value)}
          placeholder="Min baths"
          min="0"
        />
        <Input
          type="number"
          value={filters.maxBathrooms}
          onChange={(e) => updateFilter("maxBathrooms", e.target.value)}
          placeholder="Max baths"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Min Rating</label>
        <select
          value={filters.minRating}
          onChange={(e) => updateFilter("minRating", e.target.value)}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5 only</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenitiesList.map((amenity) => {
            const selected = filters.amenities?.split(",").includes(amenity.value);
            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() => toggleAmenity(amenity.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                {amenity.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="bedrooms">Bedrooms</option>
        </select>
        <select
          value={filters.sortOrder}
          onChange={(e) => updateFilter("sortOrder", e.target.value)}
          className="w-24 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
    </div>
  );
};
