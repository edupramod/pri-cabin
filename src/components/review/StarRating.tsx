"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ rating, max = 5, onChange, size = "md", className }: StarRatingProps) {
  const sizes = { sm: "h-3 w-3", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i + 1)}
          className={cn("transition-colors", onChange && "cursor-pointer hover:scale-110")}
          aria-label={`Rate ${i + 1} out of ${max}`}
        >
          <Star
            className={cn(
              sizes[size],
              i < rating ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}
