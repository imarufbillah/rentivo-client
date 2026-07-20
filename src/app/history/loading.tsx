import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8" role="status" aria-busy="true">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-4 w-64 rounded-full" />
      </div>

      <div className="mb-6 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3 rounded-full" />
              <Skeleton className="h-3 w-1/3 rounded-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading history...</span>
    </div>
  );
}
