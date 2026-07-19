"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Building, Castle, BedDouble, Warehouse } from "lucide-react";

const types = [
  { icon: Building, label: "Apartment", value: "apartment", color: "bg-blue-500/10 text-blue-600" },
  { icon: Home, label: "House", value: "house", color: "bg-green-500/10 text-green-600" },
  { icon: Warehouse, label: "Studio", value: "studio", color: "bg-purple-500/10 text-purple-600" },
  { icon: Castle, label: "Villa", value: "villa", color: "bg-amber-500/10 text-amber-600" },
  { icon: BedDouble, label: "Room", value: "room", color: "bg-rose-500/10 text-rose-600" },
];

export const PropertyTypes = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Explore by Property Type</h2>
          <p className="mt-3 text-muted-foreground">
            Find the perfect space that fits your lifestyle
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {types.map((type, i) => (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/properties?propertyType=${type.value}`}
                className="flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full ${type.color}`}>
                  <type.icon className="h-7 w-7" />
                </div>
                <span className="font-medium">{type.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
