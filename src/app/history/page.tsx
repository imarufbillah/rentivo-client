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
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Heart, Key, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

const tabs = [
  { value: "saved", label: "Saved", icon: Heart },
  { value: "viewed", label: "Viewed", icon: Eye },
  { value: "rentals", label: "Rentals", icon: Key },
] as const;

type TabValue = (typeof tabs)[number]["value"];

const rentalStatusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const RowSkeleton = () => (
  <div className="flex items-center gap-4 rounded-2xl border bg-card p-4">
    <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-2/3 rounded-full" />
      <Skeleton className="h-3 w-1/3 rounded-full" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("saved");
  const [page, setPage] = useState(1);
  const deleteInteraction = useDeleteInteraction();

  const filterType = activeTab === "saved" ? "save" : "view";
  const showInteractions = activeTab !== "rentals";

  const { data, isLoading, error } = useInteractionHistory(
    showInteractions ? filterType : undefined,
    page
  );
  const { data: rentalsData, isLoading: rentalsLoading } = useMyRentals();

  const interactions = data?.interactions || [];
  const pagination = data?.pagination;
  const rentals = rentalsData?.rentals || [];

  const handleDelete = (propertyId: string, type: string) => {
    deleteInteraction.mutate(
      { propertyId, type: type as "save" | "view" },
      {
        onSuccess: () => toast.success("Removed from history"),
        onError: () => toast.error("Failed to remove"),
      }
    );
  };

  const items = showInteractions
    ? interactions
    : activeTab === "rentals"
      ? rentals
      : [];

  const isEmpty = showInteractions
    ? interactions.length === 0 && !isLoading
    : activeTab === "rentals"
      ? rentals.length === 0 && !rentalsLoading
      : false;

  return (
    <ProtectedRoute>
      <div className="min-h-dvh mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <AppBreadcrumb segments={[{ label: "History" }]} />
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold">History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your saved properties, browsing activity, and rentals.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {(showInteractions ? isLoading : rentalsLoading) && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {showInteractions && error && (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load history. Please try again later.
            </p>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              {activeTab === "saved" && (
                <Heart className="h-8 w-8 text-muted-foreground" />
              )}
              {activeTab === "viewed" && (
                <Eye className="h-8 w-8 text-muted-foreground" />
              )}
              {activeTab === "rentals" && (
                <Key className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <h2 className="font-display text-lg font-bold">
              {activeTab === "saved" && "No saved properties"}
              {activeTab === "viewed" && "No browsing history"}
              {activeTab === "rentals" && "No rentals yet"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === "saved" &&
                "Save properties you like to see them here."}
              {activeTab === "viewed" &&
                "Browse properties to build your history."}
              {activeTab === "rentals" &&
                "Rent a property to see your rental history here."}
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button className="rounded-full">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Saved / Viewed items */}
        {showInteractions && !isLoading && !error && interactions.length > 0 && (
          <div className="space-y-3">
            {interactions.map((interaction) => {
              const Icon = interaction.type === "save" ? Heart : Eye;
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
                      {interaction.property?.location || "Unknown location"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(interaction.createdAt).toLocaleDateString()}
                    </span>

                    {interaction.type === "save" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            interaction.propertyId.toString(),
                            interaction.type
                          )
                        }
                        disabled={deleteInteraction.isPending}
                        className="rounded-full"
                        aria-label="Remove from saved"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

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
          </div>
        )}

        {/* Rentals */}
        {activeTab === "rentals" && !rentalsLoading && rentals.length > 0 && (
          <div className="space-y-3">
            {rentals.map((rental) => (
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
        )}
      </div>
    </ProtectedRoute>
  );
};

export default HistoryPage;
