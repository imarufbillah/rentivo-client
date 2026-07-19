"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useMyProperties,
  useDeleteProperty,
} from "@/hooks/useProperties";
import { PropertyWithStats } from "@/types";
import { Eye, Heart, Star, Trash2 } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  archived: "bg-muted text-muted-foreground",
  rented: "bg-primary/10 text-primary",
};

export const PropertyManagementTable = () => {
  const { data, isLoading } = useMyProperties();
  const deleteProperty = useDeleteProperty();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const properties = data?.properties || [];

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = (id: string) => {
    deleteProperty.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-12 text-center">
        <p className="font-display text-lg font-bold">No properties yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first property listing to get started
        </p>
        <Link href="/properties/add" className="mt-4">
          <Button className="rounded-full">Add Property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground md:grid">
        <div className="col-span-3">Property</div>
        <div className="col-span-1">Price</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-2 text-center">Stats</div>
        <div className="col-span-4 text-right">Actions</div>
      </div>

      {properties.map((property: PropertyWithStats) => (
        <div
          key={property._id?.toString()}
          className="flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/30 md:grid md:grid-cols-12 md:items-center md:gap-4"
        >
          <div className="col-span-3">
            <p className="line-clamp-1 font-medium text-foreground">
              {property.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {property.location}
            </p>
            <p className="text-xs text-muted-foreground">
              {property.bedrooms === 0
                ? "Studio"
                : `${property.bedrooms} bed`}{" "}
              &middot; {property.bathrooms} bath
            </p>
          </div>

          <div className="col-span-1">
            <span className="font-medium text-foreground">
              ${property.price.toLocaleString()}/mo
            </span>
          </div>

          <div className="col-span-1">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[property.status] || "bg-muted text-muted-foreground"}`}
            >
              {property.status}
            </span>
          </div>

          <div className="col-span-1">
            <span className="text-sm capitalize text-muted-foreground">
              {property.propertyType}
            </span>
          </div>

          <div className="col-span-2 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{property.viewCount}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              <span>{property.saveCount}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              <span>{property.averageRating ?? "\u2014"}</span>
            </div>
          </div>

          <div className="col-span-4 flex justify-end gap-2">
            <Link href={`/properties/${property._id}`}>
              <Button variant="outline" size="sm" className="rounded-full">
                View
              </Button>
            </Link>
            <Link href={`/properties/${property._id}/edit`}>
              <Button variant="outline" size="sm" className="rounded-full">
                Edit
              </Button>
            </Link>
            {deletingId === property._id?.toString() ? (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  className="rounded-full"
                  onClick={() =>
                    confirmDelete(property._id!.toString())
                  }
                  disabled={deleteProperty.isPending}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setDeletingId(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  handleDelete(property._id!.toString())
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
