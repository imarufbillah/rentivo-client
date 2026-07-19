"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-primary-foreground">
            Ready to Find Your Home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join hundreds of happy renters who found their perfect property
            through Rentivo. Start your search today.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/properties">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary sm:w-auto"
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
