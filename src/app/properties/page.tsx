"use client";

import { useState } from "react";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters, FilterState } from "@/components/properties/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";

const PropertiesPage = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading } = useProperties({
    search: filters.search || undefined,
    location: filters.location || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    propertyType: filters.propertyType || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const properties = (data?.data || []).map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Perfect Property</h1>
        <p className="mt-2 text-muted-foreground">
          Browse available rental properties or use filters to narrow your search
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <PropertyFilters onFilterChange={setFilters} />
        </aside>

        <section>
          <PropertyGrid properties={properties} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
};

export default PropertiesPage;
