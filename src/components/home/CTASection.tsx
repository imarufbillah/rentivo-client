"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="bg-primary py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
            Ready to Find Your Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-primary-foreground/80">
            Join hundreds of happy renters who found their perfect property
            through Rentivo. Start your search today.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/properties">
              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-full sm:w-auto"
              >
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:w-auto"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
