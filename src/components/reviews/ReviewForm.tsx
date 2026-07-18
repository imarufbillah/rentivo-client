"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/useReviews";

interface ReviewFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ propertyId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createReview = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (comment.length < 10) {
      setError("Comment must be at least 10 characters");
      return;
    }

    createReview.mutate(
      { propertyId, rating, comment },
      {
        onSuccess: () => {
          setSuccess(true);
          setRating(0);
          setComment("");
          onSuccess?.();
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: (err) => {
          setError(err.message || "Failed to submit review");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-4">
      <h3 className="font-semibold">Write a Review</h3>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-success/10 p-3 text-sm text-success">
          Review submitted successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-2xl transition-colors"
              aria-label={`Rate ${star} stars`}
            >
              <span
                className={
                  star <= (hoverRating || rating)
                    ? "text-warning"
                    : "text-muted-foreground/30"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1.5">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Share your experience with this property..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {comment.length}/1000 characters (min 10)
        </p>
      </div>

      <Button type="submit" disabled={createReview.isPending || success}>
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
