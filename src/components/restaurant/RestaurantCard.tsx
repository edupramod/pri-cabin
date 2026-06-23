import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Users, Wifi, Car, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { priceRangeLabel } from "@/lib/utils";
import type { IRestaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: IRestaurant;
  favoriteButton?: React.ReactNode;
}

export function RestaurantCard({ restaurant, favoriteButton }: RestaurantCardProps) {
  const photo = restaurant.photos?.[0];

  return (
    <Card className="group overflow-hidden border hover:shadow-md transition-shadow">
      <Link href={`/restaurants/${restaurant.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {photo ? (
            <Image
              src={photo}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No photo
            </div>
          )}
          {restaurant.amenities?.coupleSeating && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-foreground text-xs backdrop-blur-sm border-0 shadow-sm">
                Couple Friendly
              </Badge>
            </div>
          )}
          {favoriteButton && (
            <div className="absolute top-3 right-3">{favoriteButton}</div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/restaurants/${restaurant.slug}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
          </Link>
          <span className="text-sm text-muted-foreground shrink-0">
            {priceRangeLabel(restaurant.priceRange)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{restaurant.city}</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">
              {restaurant.averageRating > 0 ? restaurant.averageRating.toFixed(1) : "New"}
            </span>
            {restaurant.totalReviews > 0 && (
              <span className="text-xs text-muted-foreground">
                ({restaurant.totalReviews})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            {restaurant.amenities?.wifi && <Wifi className="h-3.5 w-3.5" />}
            {restaurant.amenities?.parking && <Car className="h-3.5 w-3.5" />}
            {restaurant.amenities?.ac && <Wind className="h-3.5 w-3.5" />}
          </div>
        </div>
      </div>
    </Card>
  );
}
