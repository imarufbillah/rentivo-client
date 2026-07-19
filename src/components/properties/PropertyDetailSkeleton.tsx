"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const PropertyDetailSkeleton = () => (
  <div className="mx-auto max-w-6xl space-y-8">
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  </div>
);
