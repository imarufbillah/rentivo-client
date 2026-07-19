"use client";

import { Property } from "@/../../rentivo-server/src/types";
import { MapPin, CalendarDays, Wifi, Droplets, Zap, Flame } from "lucide-react";

interface ListingMetaProps {
  property: Property;
}

const utilitiesList = (utilities?: string[]) => {
  if (!utilities || utilities.length === 0) return null;

  const icons: Record<string, React.ElementType> = {
    electricity: Zap,
    water: Droplets,
    gas: Flame,
    internet: Wifi,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {utilities.map((u) => {
        const Icon = icons[u];
        return (
          <span
            key={u}
            className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground"
          >
            {Icon && <Icon className="h-3 w-3" />}
            {u}
          </span>
        );
      })}
    </div>
  );
};

export const ListingMeta = ({ property }: ListingMetaProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary">
            {property.propertyType}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
            {property.status}
          </span>
          {property.availableFrom && (
            <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              Available{" "}
              {new Date(property.availableFrom).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {property.title}
        </h1>
        {property.shortDescription && (
          <p className="mt-2 text-muted-foreground">
            {property.shortDescription}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {property.fullAddress || property.location}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-display text-sm font-bold">
          About this property
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {property.utilities && utilitiesList(property.utilities)}
    </div>
  );
};
