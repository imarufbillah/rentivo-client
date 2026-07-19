"use client";

import { Property } from "@/types";
import { ShieldCheck, FileText } from "lucide-react";

interface RulesSectionProps {
  property: Property;
}

export const RulesSection = ({ property }: RulesSectionProps) => {
  const hasRules = !!property.houseRules;
  const hasTerms = !!property.rentalTerms;

  if (!hasRules && !hasTerms) return null;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-display text-sm font-bold">
        Rules & Terms
      </h3>
      <div className="space-y-4">
        {hasRules && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              House Rules
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {property.houseRules}
            </p>
          </div>
        )}
        {hasTerms && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Rental Terms
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {property.rentalTerms}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
