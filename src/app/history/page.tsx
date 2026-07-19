"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useInteractionHistory, useDeleteInteraction } from "@/hooks/useInteractions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import { toast } from "sonner";

const typeFilters = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "viewed", label: "Viewed" },
];

const typeColors: Record<string, string> = {
  save: "bg-success/10 text-success",
  view: "bg-primary/10 text-primary",
};

const typeIcons: Record<string, typeof Eye> = {
  save: Heart,
  view: Eye,
};

const typeLabels: Record<string, string> = {
  save: "Saved",
  view: "Viewed",
};

const InteractionHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const deleteInteraction = useDeleteInteraction();

  const filterType = activeFilter === "all" ? undefined :
    activeFilter === "saved" ? "save" : "view";

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

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Interaction History</h1>
          <p className="mt-2 text-muted-foreground">
            Your browsing and saving activity.
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border p-8 text-center">
            <p className="text-muted-foreground">
              Failed to load interaction history. Please try again later.
            </p>
          </div>
        ) : interactions.length > 0 ? (
          <>
            <div className="space-y-3">
              {interactions.map((interaction) => {
                const Icon = typeIcons[interaction.type];
                return (
                  <div
                    key={interaction._id?.toString()}
                    className="flex items-center gap-4 rounded-xl border p-4 hover:bg-muted/50 transition-colors"
                  >
                    {interaction.property?.images?.[0] ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={interaction.property.images[0]}
                          alt={interaction.property.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {interaction.property ? (
                        <Link
                          href={`/properties/${interaction.property._id}`}
                          className="font-medium hover:underline line-clamp-1"
                        >
                          {interaction.property.title}
                        </Link>
                      ) : (
                        <p className="font-medium text-muted-foreground line-clamp-1">
                          Property removed
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {interaction.property?.location || "Unknown location"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={typeColors[interaction.type]}>
                        <Icon className="h-3 w-3 mr-1" />
                        {typeLabels[interaction.type]}
                      </Badge>

                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(interaction.createdAt).toLocaleDateString()}
                      </span>

                      {interaction.type === "save" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUndo(interaction.propertyId.toString(), interaction.type)
                          }
                          disabled={deleteInteraction.isPending}
                        >
                          Undo
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
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border p-12 text-center">
            <h2 className="text-xl font-semibold">No interactions yet</h2>
            <p className="mt-2 text-muted-foreground">
              Start browsing properties to build your interaction history.
            </p>
            <Link href="/properties" className="mt-6 inline-block">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default InteractionHistoryPage;
