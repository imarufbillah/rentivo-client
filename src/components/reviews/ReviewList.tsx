"use client";

import { useState } from "react";
import { RatingDisplay } from "./RatingDisplay";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";
import { Star } from "lucide-react";

interface ReviewListProps {
  propertyId: string;
}

const REVIEWS_PER_PAGE = 5;

export const ReviewList = ({ propertyId }: ReviewListProps) => {
  const { data, isLoading } = useReviews(propertyId);
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-2xl border bg-card p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const averageRating = data?.averageRating;
  const totalReviews = data?.totalReviews || 0;

  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (page - 1) * REVIEWS_PER_PAGE,
    page * REVIEWS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {averageRating != null && (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
          <RatingDisplay rating={averageRating} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-2xl border bg-card py-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Star className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-display text-sm font-bold">No reviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to review this property
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedReviews.map((review) => (
            <div
              key={review._id?.toString()}
              className="rounded-2xl border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {review.userId?.toString().slice(-2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      User {review.userId?.toString().slice(-4)}
                    </p>
                    <RatingDisplay
                      rating={review.rating}
                      size="sm"
                      showValue={false}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
