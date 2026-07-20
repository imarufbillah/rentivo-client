"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, MapPin, Home, DollarSign } from "lucide-react";

const propertyTypes = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "room", label: "Room" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
];

const budgetRanges = [
  { value: "", label: "Any Budget" },
  { value: "0-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "2000-5000", label: "$2,000 - $5,000" },
  { value: "5000-999999", label: "$5,000+" },
];

export const HeroSection = () => {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType) params.set("propertyType", propertyType);
    if (budget) {
      const [min, max] = budget.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 py-24">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Heading */}
        <motion.h1
          className="font-display text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          AI-powered recommendations tailored to your lifestyle. Browse listings,
          save favorites, and let our assistant help you find the home you love.
        </motion.p>

        {/* Search form */}
        <motion.form
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 shadow-lg sm:flex-row sm:items-center">
            {/* Location */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you looking?"
                aria-label="Location"
                className="w-full rounded-xl bg-transparent py-3 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* Type */}
            <div className="relative sm:w-40">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                aria-label="Property type"
                className="w-full appearance-none rounded-xl bg-transparent py-3 pl-10 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-border sm:block" />

            {/* Budget */}
            <div className="relative sm:w-44">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                aria-label="Budget range"
                className="w-full appearance-none rounded-xl bg-transparent py-3 pl-10 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                {budgetRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <Button
              type="submit"
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 sm:px-6"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </motion.form>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="/properties">
            <Button
              variant="ghost"
              size="lg"
              className="w-full rounded-full sm:w-auto"
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <a href="/register">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full sm:w-auto"
            >
              Get Started
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
