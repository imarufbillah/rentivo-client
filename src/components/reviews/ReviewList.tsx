"use client";

import { useState } from "react";
import { RatingDisplay } from "./RatingDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";

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
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
        <div className="flex items-center gap-3 rounded-xl border p-4">
          <RatingDisplay rating={averageRating} size="lg" />
          <div>
            <p className="text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="rounded-xl border py-8 text-center">
          <p className="text-muted-foreground">No reviews yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Be the first to review this property
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div key={review._id?.toString()} className="rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {review.userId?.toString().slice(-2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      User {review.userId?.toString().slice(-4)}
                    </p>
                    <RatingDisplay rating={review.rating} size="sm" showValue={false} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
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
