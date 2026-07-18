"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/../../rentivo-server/src/types";

interface RecommendationCardProps {
  property: Property;
  explanation?: string;
  score?: number;
}

export const RecommendationCard = ({ property, explanation, score }: RecommendationCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Link href={`/properties/${property._id}`}>
      <div className="group relative h-[440px] w-full overflow-hidden rounded-xl border-2 border-primary/20 bg-card shadow-sm transition-shadow hover:shadow-md hover:border-primary/40">
        <div className="absolute right-2 top-2 z-10">
          <Badge className="bg-primary text-primary-foreground">AI Pick</Badge>
        </div>

        <div className="relative h-48 w-full overflow-hidden">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
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
            <h3 className="line-clamp-2 font-semibold">{property.title}</h3>
            <span className="whitespace-nowrap text-lg font-bold text-primary">
              ${property.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{property.location}</p>

          {explanation && (
            <p className="text-xs leading-relaxed text-muted-foreground italic">
              {explanation}
            </p>
          )}

          {score != null && (
            <div className="flex items-center gap-1">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(score * 100)}% match
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);
