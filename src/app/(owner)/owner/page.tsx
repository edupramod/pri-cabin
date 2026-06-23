export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import BookingModel from "@/models/Booking";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { CalendarDays, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { IBooking } from "@/types";

export default async function OwnerDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  const myRestaurants = await RestaurantModel.find({ ownerId: session.user.id }).select("_id name").lean();
  const restaurantIds = myRestaurants.map((r) => r._id);

  const [totalBookings, pendingBookings, approvedBookings, rejectedBookings, totalViews, recentBookings] = await Promise.all([
    BookingModel.countDocuments({ restaurantId: { $in: restaurantIds } }),
    BookingModel.countDocuments({ restaurantId: { $in: restaurantIds }, status: "pending" }),
    BookingModel.countDocuments({ restaurantId: { $in: restaurantIds }, status: "approved" }),
    BookingModel.countDocuments({ restaurantId: { $in: restaurantIds }, status: "rejected" }),
    RestaurantModel.aggregate([{ $match: { ownerId: session.user.id } }, { $group: { _id: null, total: { $sum: "$viewCount" } } }]),
    BookingModel.find({ restaurantId: { $in: restaurantIds } })
      .populate("restaurantId", "name slug")
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const views = totalViews[0]?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurants and bookings</p>
        </div>
        <Button asChild>
          <Link href="/owner/restaurants/new">Add Restaurant</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title="Total Bookings" value={totalBookings} icon={CalendarDays} />
        <MetricCard title="Pending" value={pendingBookings} icon={Clock} />
        <MetricCard title="Approved" value={approvedBookings} icon={CheckCircle} />
        <MetricCard title="Total Views" value={views} icon={Eye} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Booking Requests</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/owner/bookings">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No booking requests yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const restaurant = booking.restaurantId as { name: string; slug: string };
                const customer = booking.userId as { name: string; email: string };
                return (
                  <div key={String(booking._id)} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{customer?.name}</p>
                        <span className="text-xs text-muted-foreground">→ {restaurant?.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(booking.bookingDate)} · {formatTime(booking.bookingTime)} · {booking.peopleCount} guests
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookingStatusBadge status={booking.status as IBooking["status"]} />
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/owner/bookings/${booking._id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
