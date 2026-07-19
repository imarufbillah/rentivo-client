"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Property } from "@/../../rentivo-server/src/types";
import { MapPin, Bed, Bath, Sparkles } from "lucide-react";

interface RecommendationCardProps {
  property: Property;
  explanation?: string;
  score?: number;
}

export const RecommendationCard = ({
  property,
  explanation,
  score,
}: RecommendationCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Link href={`/properties/${property._id}`}>
      <div className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="absolute right-3 top-3 z-10">
          <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            <Sparkles className="h-3 w-3" />
            AI Pick
          </span>
        </div>

        <div className="relative h-48 w-full overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-display text-sm font-bold text-foreground">
              {property.title}
            </h3>
            <span className="whitespace-nowrap text-lg font-bold text-foreground">
              ${property.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {property.location}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              {property.bedrooms === 0 ? "Studio" : property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" />
              {property.bathrooms}
            </span>
          </div>

          {explanation && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground italic">
              {explanation}
            </p>
          )}

          {score != null && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(score * 100)}% match
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);
