import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-busy="true">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-64 rounded-full" />
        <Skeleton className="h-4 w-48 rounded-full" />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border bg-card p-4">
            <Skeleton className="mb-2 h-4 w-20 rounded-full" />
            <Skeleton className="h-8 w-12 rounded-full" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <span className="sr-only">Loading dashboard...</span>
    </div>
  );
}
