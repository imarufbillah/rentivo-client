"use client";

import { ListingCard } from "@/components/properties/ListingCard";
import { Property } from "@/types";
import { Sparkles } from "lucide-react";

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
  <ListingCard
    property={property}
    badge={
      <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
        <Sparkles className="h-3 w-3" />
        AI Pick
      </span>
    }
    meta={
      <>
        {explanation && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground italic">
            {explanation}
          </p>
        )}
        {score != null && (
          <div className="mt-1.5 flex items-center gap-2">
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
      </>
    }
  />
);
