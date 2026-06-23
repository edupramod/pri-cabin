export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import BookingModel from "@/models/Booking";
import CabinModel from "@/models/Cabin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CalendarDays, Eye, Star, DoorClosed } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Restaurant" };

export default async function OwnerRestaurantPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const { id } = await params;

  const restaurant = await RestaurantModel.findById(id).lean() as any;
  if (!restaurant) notFound();
  if (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/owner/restaurants");
  }

  const [totalBookings, pendingBookings, cabins] = await Promise.all([
    BookingModel.countDocuments({ restaurantId: id }),
    BookingModel.countDocuments({ restaurantId: id, status: "pending" }),
    CabinModel.find({ restaurantId: id }).lean(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          <p className="text-muted-foreground mt-1">{restaurant.address}, {restaurant.city}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/restaurants/${restaurant.slug}`} target="_blank">View Public</Link>
          </Button>
          <Button asChild>
            <Link href={`/owner/restaurants/${id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title="Total Bookings" value={totalBookings} icon={CalendarDays} />
        <MetricCard title="Pending" value={pendingBookings} icon={CalendarDays} />
        <MetricCard title="Views" value={restaurant.viewCount} icon={Eye} />
        <MetricCard title="Rating" value={`${restaurant.averageRating.toFixed(1)} ★`} icon={Star} description={`${restaurant.totalReviews} reviews`} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Private Spaces ({cabins.length})</CardTitle>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/owner/cabins?restaurantId=${id}`}>Manage</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {cabins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No spaces added yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {cabins.map((cabin) => (
                <div key={String(cabin._id)} className="flex items-center gap-3 rounded-lg border p-3">
                  <DoorClosed className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{cabin.name}</p>
                    <p className="text-xs text-muted-foreground">{cabin.privacyType} · {cabin.capacity} guests</p>
                  </div>
                  <Badge variant={cabin.active ? "success" : "secondary"} className="ml-auto text-xs">
                    {cabin.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
