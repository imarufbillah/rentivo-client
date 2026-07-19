"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Key } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description: "Browse hundreds of listings with smart filters for location, price, amenities, and more.",
  },
  {
    icon: Sparkles,
    title: "Get AI Recommendations",
    description: "Our AI learns your preferences and suggests properties that match your lifestyle.",
  },
  {
    icon: Key,
    title: "Move In",
    description: "Found the one? Secure your rental with our seamless Stripe-powered checkout.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-3 text-muted-foreground">
            Three simple steps to find your next home
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative flex flex-col items-center gap-4 rounded-xl border p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <span className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
