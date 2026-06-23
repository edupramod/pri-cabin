export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { FavoriteModel } from "@/models/Favorite";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { IRestaurant } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Saved Restaurants" };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/favorites");

  await connectDB();
  const favorites = await FavoriteModel.find({ userId: session.user.id })
    .populate("restaurantId")
    .sort({ createdAt: -1 })
    .lean();

  const restaurants = favorites
    .map((f) => f.restaurantId)
    .filter(Boolean) as unknown as IRestaurant[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Restaurants</h1>
          <p className="text-muted-foreground mt-1">{restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} saved</p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved restaurants yet"
          description="Save restaurants you love to find them easily later."
          action={<Button asChild><Link href="/restaurants">Browse Restaurants</Link></Button>}
        />
      ) : (
        <RestaurantGrid restaurants={restaurants} showFavorite />
      )}
    </div>
  );
}
