import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-busy="true">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: gallery */}
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-24 rounded-xl" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-full" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
      <span className="sr-only">Loading property details...</span>
    </div>
  );
}
