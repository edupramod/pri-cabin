export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import RestaurantModel from "@/models/Restaurant";
import BookingModel from "@/models/Booking";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { Users, UtensilsCrossed, CalendarDays, Eye, Star, Clock } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import type { IBooking } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Analytics" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();

  const [
    totalUsers, totalRestaurants, verifiedRestaurants, pendingRestaurants,
    totalBookings, pendingBookings, topRestaurants, recentBookings
  ] = await Promise.all([
    UserModel.countDocuments(),
    RestaurantModel.countDocuments(),
    RestaurantModel.countDocuments({ verified: "verified" }),
    RestaurantModel.countDocuments({ verified: "pending" }),
    BookingModel.countDocuments(),
    BookingModel.countDocuments({ status: "pending" }),
    RestaurantModel.find({ verified: "verified" })
      .sort({ viewCount: -1 })
      .limit(5)
      .select("name viewCount averageRating totalReviews")
      .lean(),
    BookingModel.find()
      .populate("restaurantId", "name slug")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">Overview of platform activity</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard title="Total Users" value={totalUsers} icon={Users} />
        <MetricCard title="Restaurants" value={totalRestaurants} icon={UtensilsCrossed} description={`${verifiedRestaurants} verified · ${pendingRestaurants} pending`} />
        <MetricCard title="Total Bookings" value={totalBookings} icon={CalendarDays} description={`${pendingBookings} pending`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" /> Most Viewed Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topRestaurants.map((r, i) => (
                <div key={String(r._id)} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {r.averageRating.toFixed(1)} · {r.totalReviews} reviews
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{r.viewCount.toLocaleString()} views</span>
                </div>
              ))}
              {topRestaurants.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const restaurant = booking.restaurantId as { name: string };
                const customer = booking.userId as { name: string };
                return (
                  <div key={String(booking._id)} className="flex items-center justify-between gap-4 py-1 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{customer?.name}</p>
                      <p className="text-xs text-muted-foreground">{restaurant?.name} · {formatDate(booking.bookingDate)}</p>
                    </div>
                    <BookingStatusBadge status={booking.status as IBooking["status"]} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
