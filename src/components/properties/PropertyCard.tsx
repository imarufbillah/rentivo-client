"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Star } from "lucide-react";

interface PropertyCardProps {
  property: {
    _id?: string | { toString(): string };
    title: string;
    shortDescription?: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    images: string[];
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    averageRating?: number | null;
    reviewCount?: number;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const propertyId = property._id?.toString() || "";

  return (
    <Link href={`/properties/${propertyId}`} className="group block">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
              No image
            </div>
          )}
          {/* Type badge */}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {property.propertyType}
            </span>
          </div>
          {/* Rating badge */}
          {property.averageRating != null && (
            <div className="absolute right-3 top-3">
              <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <span className="whitespace-nowrap text-base font-bold text-foreground">
              ${property.price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">
                /mo
              </span>
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {property.shortDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {property.shortDescription}
            </p>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs text-muted-foreground">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {property.bathrooms} bath
              </span>
            )}
            {property.reviewCount != null && property.reviewCount > 0 && (
              <span className="ml-auto text-muted-foreground">
                {property.reviewCount} review{property.reviewCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
