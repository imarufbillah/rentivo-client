"use client";

import { Property } from "@/../../rentivo-server/src/types";
import { Badge } from "@/components/ui/badge";
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
          <Badge key={u} variant="outline" className="gap-1 capitalize">
            {Icon && <Icon className="h-3 w-3" />}
            {u}
          </Badge>
        );
      })}
    </div>
  );
};

export const ListingMeta = ({ property }: ListingMetaProps) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {property.propertyType}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {property.status}
          </Badge>
          {property.availableFrom && (
            <Badge variant="outline" className="gap-1">
              <CalendarDays className="h-3 w-3" />
              Available {new Date(property.availableFrom).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold">{property.title}</h1>
        {property.shortDescription && (
          <p className="mt-2 text-muted-foreground">{property.shortDescription}</p>
        )}
        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {property.fullAddress || property.location}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-semibold">About this property</h2>
        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {property.utilities && utilitiesList(property.utilities)}
    </div>
  );
};
