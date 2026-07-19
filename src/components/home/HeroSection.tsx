"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Property Matching
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Find Your Perfect{" "}
          <span className="text-primary">Rental Home</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Smart AI recommendations tailored to your lifestyle. Browse listings,
          save favorites, and let our assistant help you find the home you love.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/properties">
            <Button size="lg" className="w-full sm:w-auto">
              Browse Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
