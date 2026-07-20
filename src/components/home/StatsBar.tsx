"use client";

import { motion } from "framer-motion";
import { Home, Users, Star, MessageSquare } from "lucide-react";
import { useStats } from "@/hooks/useStats";

export const StatsBar = () => {
  const { data: stats } = useStats();

  const items = [
    {
      icon: Home,
      value: stats ? `${stats.properties}+` : "—",
      label: "Properties Listed",
    },
    {
      icon: Users,
      value: stats ? `${stats.renters}+` : "—",
      label: "Renters",
    },
    {
      icon: Star,
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "—",
      label: "Average Rating",
    },
    {
      icon: MessageSquare,
      value: stats ? `${stats.reviews}+` : "—",
      label: "Reviews",
    },
  ];

  return (
    <section className="border-y bg-muted/30 py-14" aria-label="Platform statistics">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat, i) => (
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
