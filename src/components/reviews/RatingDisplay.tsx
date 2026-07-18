"use client";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const Star = ({ fill }: { fill: "full" | "half" | "empty" }) => (
  <svg className="inline-block" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="halfStar">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={
        fill === "full"
          ? "currentColor"
          : fill === "half"
          ? "url(#halfStar)"
          : "none"
      }
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

export const RatingDisplay = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
}: RatingDisplayProps) => {
  const sizeClasses = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const starIndex = i + 1;
    if (starIndex <= Math.floor(rating)) return "full";
    if (starIndex - 0.5 <= rating) return "half";
    return "empty";
  });

  return (
    <span className="inline-flex items-center gap-0.5 text-warning">
      {stars.map((fill, i) => (
        <span key={i} className={sizeClasses[size]}>
          <Star fill={fill} />
        </span>
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
};
