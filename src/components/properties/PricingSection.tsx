"use client";

import { Property } from "@/../../rentivo-server/src/types";
import { DollarSign, Shield, Calendar, Clock } from "lucide-react";

interface PricingSectionProps {
  property: Property;
}

export const PricingSection = ({ property }: PricingSectionProps) => {
  const items = [
    {
      icon: DollarSign,
      label: "Monthly Rent",
      value: `$${property.price.toLocaleString()}`,
      highlight: true,
    },
  ];

  if (property.securityDeposit) {
    items.push({
      icon: Shield,
      label: "Security Deposit",
      value: `$${property.securityDeposit.toLocaleString()}`,
      highlight: false,
    });
  }

  if (property.advancePayment) {
    items.push({
      icon: Calendar,
      label: "Advance Payment",
      value: `$${property.advancePayment.toLocaleString()}`,
      highlight: false,
    });
  }

  if (property.leaseDuration) {
    items.push({
      icon: Clock,
      label: "Lease Duration",
      value: `${property.leaseDuration} months`,
      highlight: false,
    });
  }

  if (property.minStay) {
    items.push({
      icon: Clock,
      label: "Minimum Stay",
      value: `${property.minStay} months`,
      highlight: false,
    });
  }

  return (
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 font-semibold">Pricing & Terms</h3>
      <div className="space-y-3">
        {items.map(({ icon: Icon, label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4" />
              {label}
            </div>
            <span className={`text-sm font-medium ${highlight ? "text-lg text-primary" : ""}`}>
              {value}
              {highlight && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
