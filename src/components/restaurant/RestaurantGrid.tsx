import { RestaurantCard } from "./RestaurantCard";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import type { IRestaurant } from "@/types";

interface RestaurantGridProps {
  restaurants: IRestaurant[];
  showFavorite?: boolean;
}

export function RestaurantGrid({ restaurants, showFavorite = true }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No restaurants found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant._id}
          restaurant={restaurant}
          favoriteButton={
            showFavorite ? (
              <FavoriteButton restaurantId={restaurant._id.toString()} />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}
