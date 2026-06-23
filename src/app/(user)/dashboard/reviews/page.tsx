"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/review/StarRating";
import { ReviewCard } from "@/components/review/ReviewCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Star, Loader2 } from "lucide-react";
import type { IReview } from "@/types";

export default function UserReviewsPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { toast } = useToast();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "Review submitted!" });
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast({ title: "Review removed" });
      fetchReviews();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Reviews</h1>

      {bookingId && (
        <Card>
          <CardHeader><CardTitle className="text-base">Write a Review</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <StarRating rating={rating} onChange={setRating} size="lg" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  minLength={10}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="After completing a booking, you can leave a review for the restaurant."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <ReviewCard review={review} canDelete onDelete={deleteReview} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
