"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 py-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Property Matching
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-display text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Find Your Perfect
          <br />
          <span className="text-primary">Rental Home</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          Smart AI recommendations tailored to your lifestyle. Browse listings,
          save favorites, and let our assistant help you find the home you love.
        </motion.p>

        {/* Search bar */}
        <motion.div
          className="mx-auto mt-10 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/properties">
            <div className="group flex items-center gap-3 rounded-2xl border bg-card px-5 py-4 shadow-md transition-all duration-300 hover:shadow-lg">
              <Search className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="flex-1 text-left text-muted-foreground">
                Search by location, type, or keyword...
              </span>
              <div className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
                Search
              </div>
            </div>
          </Link>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/properties">
            <Button
              size="lg"
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full sm:w-auto"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
