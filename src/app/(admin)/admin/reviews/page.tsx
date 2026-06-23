export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import ReviewModel from "@/models/Review";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/review/StarRating";
import { getInitials, formatDate } from "@/lib/utils";
import { DeleteReviewButton } from "./DeleteReviewButton";
import { EmptyState } from "@/components/common/EmptyState";
import { Star } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Review Moderation" };

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();
  const reviews = await ReviewModel.find({})
    .populate("userId", "name avatar email")
    .populate("restaurantId", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-muted-foreground mt-1">{reviews.length} total reviews</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Customer reviews will appear here." />
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const user = review.userId as { name: string; avatar?: string; email: string };
            const restaurant = review.restaurantId as { name: string; slug: string };
            return (
              <Card key={String(review._id)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-xs">{getInitials(user?.name || "U")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{user?.name}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-muted-foreground">on</span>
                          <Link href={`/restaurants/${restaurant?.slug}`} className="text-xs text-primary hover:underline font-medium">
                            {restaurant?.name}
                          </Link>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt.toString())}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                        {review.photos?.length > 0 && (
                          <div className="mt-2 flex gap-1.5 flex-wrap">
                            {(review.photos as string[]).map((p: string, i: number) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={p} alt="" className="h-12 w-12 rounded object-cover" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <DeleteReviewButton reviewId={String(review._id)} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
