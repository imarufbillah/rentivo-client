"use client";

import { useState, useEffect, useCallback } from "react";
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
  sortBy: string;
  sortOrder: string;
}

const propertyTypes = ["", "apartment", "house", "room", "studio", "villa"];

export const PropertyFilters = ({ onFilterChange, initialFilters }: PropertyFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || "",
    location: initialFilters?.location || "",
    minPrice: initialFilters?.minPrice || "",
    maxPrice: initialFilters?.maxPrice || "",
    propertyType: initialFilters?.propertyType || "",
    sortBy: initialFilters?.sortBy || "createdAt",
    sortOrder: initialFilters?.sortOrder || "desc",
  });

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

  useEffect(() => {
    debouncedOnChange(filters);
  }, [filters, debouncedOnChange]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const empty: FilterState = {
      search: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  const hasActiveFilters =
    filters.search || filters.location || filters.minPrice || filters.maxPrice || filters.propertyType;

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

      <div className="flex gap-3">
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
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
