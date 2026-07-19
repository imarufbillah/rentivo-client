"use client";

import { motion } from "framer-motion";
import { Home, Users, Star, MapPin } from "lucide-react";

const stats = [
  { icon: Home, value: "500+", label: "Properties Listed" },
  { icon: Users, value: "200+", label: "Happy Renters" },
  { icon: Star, value: "4.8", label: "Average Rating" },
  { icon: MapPin, value: "50+", label: "Cities Covered" },
];

export const StatsBar = () => {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <stat.icon className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
