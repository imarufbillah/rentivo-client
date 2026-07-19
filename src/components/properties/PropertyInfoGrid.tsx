"use client";

import { Property } from "@/types";
import { Bed, Bath, Ruler, Building, Layers, Car } from "lucide-react";

interface PropertyInfoGridProps {
  property: Property;
}

interface InfoItem {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const infoItems = (property: Property): InfoItem[] => {
  const items: InfoItem[] = [
    {
      icon: Bed,
      label: "Bedrooms",
      value: property.bedrooms === 0 ? "Studio" : property.bedrooms,
    },
    {
      icon: Bath,
      label: "Bathrooms",
      value: property.bathrooms,
    },
  ];

  if (property.size) {
    items.push({
      icon: Ruler,
      label: "Size",
      value: `${property.size} sqft`,
    });
  }

  if (property.floor && property.totalFloors) {
    items.push({
      icon: Layers,
      label: "Floor",
      value: `${property.floor} / ${property.totalFloors}`,
    });
  } else if (property.totalFloors) {
    items.push({
      icon: Building,
      label: "Total Floors",
      value: property.totalFloors,
    });
  }

  if (property.parking && property.parking !== "none") {
    items.push({
      icon: Car,
      label: "Parking",
      value: property.parking === "included" ? "Included" : "Available",
    });
  }

  return items;
};

export const PropertyInfoGrid = ({ property }: PropertyInfoGridProps) => {
  const items = infoItems(property);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border bg-card p-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
