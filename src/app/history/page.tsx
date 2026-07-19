"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  useInteractionHistory,
  useDeleteInteraction,
} from "@/hooks/useInteractions";
import { useMyRentals } from "@/hooks/useRentals";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Key, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

const typeFilters = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "viewed", label: "Viewed" },
  { value: "rentals", label: "Rentals" },
];

const typeConfig: Record<
  string,
  { icon: typeof Eye; color: string; label: string }
> = {
  save: {
    icon: Heart,
    color: "bg-primary/10 text-primary",
    label: "Saved",
  },
  view: {
    icon: Eye,
    color: "bg-muted text-muted-foreground",
    label: "Viewed",
  },
};

const rentalStatusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const InteractionHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const deleteInteraction = useDeleteInteraction();
  const { data: rentalsData, isLoading: rentalsLoading } = useMyRentals();

  const filterType =
    activeFilter === "all"
      ? undefined
      : activeFilter === "saved"
        ? "save"
        : "view";

  const { data, isLoading, error } = useInteractionHistory(filterType, page);
  const interactions = data?.interactions || [];
  const pagination = data?.pagination;

  const handleUndo = (propertyId: string, type: string) => {
    deleteInteraction.mutate(
      { propertyId, type: type as "save" | "view" },
      {
        onSuccess: () => {
          toast.success("Interaction removed");
        },
        onError: () => {
          toast.error("Failed to remove interaction");
        },
      }
    );
  };

  const showRentals = activeFilter === "rentals";
  const showInteractions = !showRentals;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your browsing, saving activity, and rental history.
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {showRentals ? (
          rentalsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl bg-muted"
                />
              ))}
            </div>
          ) : rentalsData?.rentals && rentalsData.rentals.length > 0 ? (
            <div className="space-y-3">
              {rentalsData.rentals.map((rental) => (
                <div
                  key={rental._id?.toString()}
                  className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30"
                >
                  {rental.property?.images?.[0] ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={rental.property.images[0]}
                        alt={rental.property.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <Key className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {rental.property ? (
                      <Link
                        href={`/properties/${rental.property._id}`}
                        className="line-clamp-1 font-medium text-foreground hover:underline"
                      >
                        {rental.property.title}
                      </Link>
                    ) : (
                      <p className="line-clamp-1 font-medium text-muted-foreground">
                        Property removed
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {rental.property?.location || "Unknown location"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        rentalStatusColors[rental.status] ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {rental.status.charAt(0).toUpperCase() +
                        rental.status.slice(1)}
                    </span>

                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        ${rental.monthlyRent.toLocaleString()}/mo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rental.leaseDuration} months
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(rental.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border bg-card p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="font-display text-lg font-bold">No rentals yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Rent a property to see your rental history here.
              </p>
              <Link href="/properties" className="mt-6 inline-block">
                <Button className="rounded-full">Browse Properties</Button>
              </Link>
            </div>
          )
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              Failed to load interaction history. Please try again later.
            </p>
          </div>
        ) : interactions.length > 0 ? (
          <>
            <div className="space-y-3">
              {interactions
                .filter((i) => typeConfig[i.type])
                .map((interaction) => {
                  const config = typeConfig[interaction.type];
                  const Icon = config.icon;
                  return (
                    <div
                      key={interaction._id?.toString()}
                      className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30"
                    >
                      {interaction.property?.images?.[0] ? (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={interaction.property.images[0]}
                            alt={interaction.property.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        {interaction.property ? (
                          <Link
                            href={`/properties/${interaction.property._id}`}
                            className="line-clamp-1 font-medium text-foreground hover:underline"
                          >
                            {interaction.property.title}
                          </Link>
                        ) : (
                          <p className="line-clamp-1 font-medium text-muted-foreground">
                            Property removed
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {interaction.property?.location ||
                            "Unknown location"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>

                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(
                            interaction.createdAt
                          ).toLocaleDateString()}
                        </span>

                        {interaction.type === "save" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUndo(
                                interaction.propertyId.toString(),
                                interaction.type
                              )
                            }
                            disabled={deleteInteraction.isPending}
                            className="rounded-full"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-lg font-bold">
              No interactions yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start browsing properties to build your interaction history.
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button className="rounded-full">Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default InteractionHistoryPage;
