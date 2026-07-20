"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRecentReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";

export const Testimonials = () => {
  const { data, isLoading } = useRecentReviews();
  const reviews = data?.reviews || [];

  if (!isLoading && reviews.length === 0) return null;

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
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-card p-6"
                >
                  <Skeleton className="mb-4 h-4 w-24 rounded-full" />
                  <Skeleton className="mb-2 h-4 w-full rounded-full" />
                  <Skeleton className="mb-2 h-4 w-3/4 rounded-full" />
                  <div className="mt-5 flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-3 w-32 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            : reviews.slice(0, 3).map((review, i) => (
                <motion.div
                  key={review._id?.toString() || i}
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
                  <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {(review.userName || "A")
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {review.userName || "Anonymous"}
                      </p>
                      {review.propertyTitle && (
                        <Link
                          href={`/properties/${review.propertyId}`}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          {review.propertyTitle}
                          {review.propertyLocation && ` · ${review.propertyLocation}`}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
};
