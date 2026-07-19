"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer, New York",
    quote:
      "Rentivo's AI found me the perfect apartment in under 10 minutes. The recommendations were spot-on with what I was looking for.",
    rating: 5,
  },
  {
    name: "James M.",
    role: "Marketing Manager, Brooklyn",
    quote:
      "The chat assistant answered all my questions about the neighborhood and lease terms. Made the whole process stress-free.",
    rating: 5,
  },
  {
    name: "Priya R.",
    role: "Graduate Student, Manhattan",
    quote:
      "As a student on a budget, I loved how the AI filtered properties within my price range while still matching my preferences.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            What Our Renters Say
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Real experiences from real people
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="relative rounded-2xl border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/10" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
