"use client";

import { ListingCard } from "./ListingCard";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return <ListingCard property={property} />;
};
