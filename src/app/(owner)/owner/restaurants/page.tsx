export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { UtensilsCrossed, Plus, Star, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Restaurants" };

const VERIFICATION_BADGE: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  pending: "warning",
  verified: "success",
  rejected: "destructive",
  suspended: "secondary",
};

export default async function OwnerRestaurantsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const restaurants = await RestaurantModel.find({ ownerId: session.user.id }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Restaurants</h1>
        <Button asChild>
          <Link href="/owner/restaurants/new">
            <Plus className="h-4 w-4" /> Add Restaurant
          </Link>
        </Button>
      </div>

      {restaurants.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No restaurants yet"
          description="Add your first restaurant to start receiving bookings."
          action={<Button asChild><Link href="/owner/restaurants/new">Add Restaurant</Link></Button>}
        />
      ) : (
        <div className="space-y-4">
          {restaurants.map((r) => (
            <Card key={String(r._id)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {r.photos?.[0] ? (
                    <div className="relative h-20 w-28 rounded-md overflow-hidden shrink-0">
                      <Image src={r.photos[0]} alt={r.name} fill className="object-cover" sizes="112px" />
                    </div>
                  ) : (
                    <div className="flex h-20 w-28 items-center justify-center rounded-md bg-muted shrink-0">
                      <UtensilsCrossed className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.address}, {r.city}</p>
                      </div>
                      <Badge variant={VERIFICATION_BADGE[r.verified] || "outline"}>
                        {r.verified.charAt(0).toUpperCase() + r.verified.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{r.averageRating.toFixed(1)} ({r.totalReviews})</span>
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{r.viewCount} views</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/owner/restaurants/${r._id}/edit`}>Edit</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/restaurants/${r.slug}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/owner/cabins?restaurantId=${r._id}`}>Cabins</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
