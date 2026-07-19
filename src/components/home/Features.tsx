"use client";

import { motion } from "framer-motion";
import { Brain, MessageSquare, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Recommendations",
    description:
      "Our AI analyzes your browsing patterns and preferences to suggest properties you will love.",
  },
  {
    icon: MessageSquare,
    title: "Smart Chat Assistant",
    description:
      "Ask our AI assistant anything about properties, neighborhoods, or the rental process.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay rent and deposits securely through Stripe with full payment protection.",
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "Every property is reviewed and verified by our team to ensure quality and accuracy.",
  },
];

export const Features = () => {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Rentivo
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need for a seamless rental experience
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
