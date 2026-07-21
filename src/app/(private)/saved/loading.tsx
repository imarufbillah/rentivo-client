import { Skeleton } from "@/components/ui/skeleton";

export default function SavedLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-busy="true">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-4 w-64 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border bg-card">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading saved properties...</span>
    </div>
  );
}
