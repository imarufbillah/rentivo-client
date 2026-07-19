"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "@/hooks/useReviews";
import { Loader2, CheckCircle } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border bg-card p-5"
    >
      <h3 className="font-display text-sm font-bold">Write a Review</h3>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-600"
        >
          <CheckCircle className="h-4 w-4" />
          Review submitted successfully!
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Rating
        </label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-2xl transition-colors"
              aria-label={`Rate ${star} stars`}
              aria-pressed={star <= rating}
              role="radio"
              aria-checked={star === rating}
            >
              <span
                className={
                  star <= (hoverRating || rating)
                    ? "text-amber-400"
                    : "text-muted-foreground/30"
                }
                aria-hidden="true"
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="comment"
          className="text-sm font-medium text-foreground"
        >
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Share your experience with this property..."
        />
        <p className="text-xs text-muted-foreground">
          {comment.length}/1000 characters (min 10)
        </p>
      </div>

      <Button
        type="submit"
        className="rounded-full"
        disabled={createReview.isPending || success}
      >
        {createReview.isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
