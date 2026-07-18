"use client";

import { useState, useCallback } from "react";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters, FilterState } from "@/components/properties/PropertyFilters";
import { useProperties } from "@/hooks/useProperties";

const PropertiesPage = () => {
  const [page, setPage] = useState(1);
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
    page,
    limit: 12,
  });

  const properties = (data?.data || []).map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

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
          <PropertyFilters onFilterChange={handleFilterChange} />
        </aside>

        <section>
          <PropertyGrid properties={properties} isLoading={isLoading} />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={() => setPage(pageNum)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? "bg-primary text-primary-foreground"
                        : "border hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
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
