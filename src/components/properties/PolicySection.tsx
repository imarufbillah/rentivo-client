"use client";

import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Dog, Cigarette, Sofa, Sparkles } from "lucide-react";

interface PolicySectionProps {
  property: Property;
}

const policyBadgeVariant = (value: string) => {
  switch (value) {
    case "allowed":
    case "included":
    case "excellent":
    case "new":
      return "default";
    case "case-by-case":
    case "good":
    case "semi-furnished":
      return "secondary";
    case "not-allowed":
    case "none":
    case "unfurnished":
      return "outline";
    default:
      return "secondary";
  }
};

const formatValue = (value: string) =>
  value
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const PolicySection = ({ property }: PolicySectionProps) => {
  const policies: Array<{ icon: React.ElementType; label: string; value?: string }> = [
    { icon: Dog, label: "Pet Policy", value: property.petPolicy },
    { icon: Cigarette, label: "Smoking", value: property.smokingPolicy },
    { icon: Sofa, label: "Furnishing", value: property.furnishing },
    { icon: Sparkles, label: "Condition", value: property.condition },
  ];

  const activePolicies = policies.filter((p) => p.value);

  if (activePolicies.length === 0) return null;

  return (
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 font-semibold">Policies & Status</h3>
      <div className="space-y-3">
        {activePolicies.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4" />
              {label}
            </div>
            <Badge variant={policyBadgeVariant(value!)}>
              {formatValue(value!)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
