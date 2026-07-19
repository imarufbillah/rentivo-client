"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Building, Castle, BedDouble, Warehouse } from "lucide-react";

const types = [
  {
    icon: Building,
    label: "Apartment",
    value: "apartment",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Home,
    label: "House",
    value: "house",
    color: "bg-success/10 text-success",
  },
  {
    icon: Warehouse,
    label: "Studio",
    value: "studio",
    color: "bg-info/10 text-info",
  },
  {
    icon: Castle,
    label: "Villa",
    value: "villa",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: BedDouble,
    label: "Room",
    value: "room",
    color: "bg-destructive/10 text-destructive",
  },
];

export const PropertyTypes = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Explore by Property Type
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Find the perfect space that fits your lifestyle
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {types.map((type, i) => (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/properties?propertyType=${type.value}`}
                className="group flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${type.color} transition-transform group-hover:scale-110`}
                >
                  <type.icon className="h-7 w-7" />
                </div>
                <span className="font-medium text-foreground">
                  {type.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
