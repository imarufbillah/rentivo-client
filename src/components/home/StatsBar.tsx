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
    <section className="border-y bg-muted/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="font-display text-3xl font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
