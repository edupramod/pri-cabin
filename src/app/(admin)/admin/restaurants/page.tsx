export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { UtensilsCrossed, MapPin, Phone, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { VerifyRestaurantButtons } from "./VerifyRestaurantButtons";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Restaurant Verification" };

const BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  pending: "warning", verified: "success", rejected: "destructive", suspended: "secondary",
};

export default async function AdminRestaurantsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();
  const restaurants = await RestaurantModel.find({})
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const pending = restaurants.filter((r) => r.verified === "pending");
  const others = restaurants.filter((r) => r.verified !== "pending");

  const renderRestaurant = (r: (typeof restaurants)[0]) => {
    const owner = r.ownerId as { name: string; email: string };
    return (
      <Card key={String((r as {_id: string})._id as unknown as string)}>
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
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Owner: {owner?.name} ({owner?.email})
                  </p>
                </div>
                <Badge variant={BADGE_VARIANT[r.verified] || "outline"}>
                  {r.verified}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{r.address}, {r.city}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{r.phone}</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{r.viewCount} views</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.description}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <Link
                  href={`/restaurants/${r.slug}`}
                  className="text-xs text-primary hover:underline"
                  target="_blank"
                >
                  View listing →
                </Link>
                <VerifyRestaurantButtons restaurantId={String((r as {_id: string})._id as unknown as string)} currentStatus={r.verified} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Restaurant Verification</h1>

      {restaurants.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="No restaurants" description="No restaurants have been submitted yet." />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                Pending Verification
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                  {pending.length}
                </span>
              </h2>
              <div className="space-y-3">{pending.map(renderRestaurant)}</div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3 text-muted-foreground">All Restaurants</h2>
              <div className="space-y-3">{others.map(renderRestaurant)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
