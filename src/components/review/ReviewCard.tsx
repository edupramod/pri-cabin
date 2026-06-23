import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import type { IReview } from "@/types";

interface ReviewCardProps {
  review: IReview;
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export function ReviewCard({ review, onDelete, canDelete }: ReviewCardProps) {
  const user = review.userId as { name: string; avatar?: string };

  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-xs">{getInitials(user?.name || "U")}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{formatDate(review.createdAt)}</span>
            </div>
            {canDelete && onDelete && (
              <button
                onClick={() => onDelete(review._id)}
                className="text-xs text-destructive hover:underline shrink-0"
              >
                Remove
              </button>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" className="mt-1" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          {review.photos?.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {review.photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={photo} alt="" className="h-16 w-16 rounded-md object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
