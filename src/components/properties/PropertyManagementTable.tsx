"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMyProperties, useDeleteProperty } from "@/hooks/useProperties";
import { Property } from "@/../../rentivo-server/src/types";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  archived: "bg-muted text-muted-foreground",
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
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border py-12 text-center">
        <p className="text-lg font-semibold">No properties yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first property listing to get started
        </p>
        <Link href="/properties/add">
          <Button className="mt-4">Add Property</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-4">Property</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {properties.map((property: Property) => (
        <div key={property._id?.toString()} className="flex flex-col gap-3 rounded-xl border p-4 md:grid md:grid-cols-12 md:items-center md:gap-4 md:p-4">
          <div className="col-span-4">
            <p className="font-medium line-clamp-1">{property.title}</p>
            <p className="text-sm text-muted-foreground">{property.location}</p>
          </div>

          <div className="col-span-2">
            <span className="font-semibold">${property.price.toLocaleString()}/mo</span>
          </div>

          <div className="col-span-2">
            <Badge className={statusColors[property.status]}>
              {property.status}
            </Badge>
          </div>

          <div className="col-span-2">
            <span className="text-sm capitalize">{property.propertyType}</span>
          </div>

          <div className="col-span-2 flex justify-end gap-2">
            <Link href={`/properties/${property._id}`}>
              <Button variant="outline" size="sm">View</Button>
            </Link>
            <Link href={`/properties/${property._id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
            {deletingId === property._id?.toString() ? (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmDelete(property._id!.toString())}
                  disabled={deleteProperty.isPending}
                >
                  Confirm
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeletingId(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(property._id!.toString())}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
