"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Key } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description:
      "Browse hundreds of listings with smart filters for location, price, amenities, and more.",
  },
  {
    icon: Sparkles,
    title: "Get AI Recommendations",
    description:
      "Our AI learns your preferences and suggests properties that match your lifestyle.",
  },
  {
    icon: Key,
    title: "Move In",
    description:
      "Found the one? Secure your rental with our seamless Stripe-powered checkout.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Three simple steps to find your next home
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative flex flex-col items-center gap-5 rounded-2xl border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-8 w-8" />
              </div>
              <span className="absolute -top-3 left-8 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="font-display text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
