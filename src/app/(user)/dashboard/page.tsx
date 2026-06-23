export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import { FavoriteModel } from "@/models/Favorite";
import ReviewModel from "@/models/Review";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CalendarDays, Heart, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { IBooking } from "@/types";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = session.user.id;

  const [totalBookings, pendingBookings, savedCount, reviewCount, recentBookings] = await Promise.all([
    BookingModel.countDocuments({ userId }),
    BookingModel.countDocuments({ userId, status: "pending" }),
    FavoriteModel.countDocuments({ userId }),
    ReviewModel.countDocuments({ userId }),
    BookingModel.find({ userId })
      .populate("restaurantId", "name slug")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session.user.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your account</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title="Total Bookings" value={totalBookings} icon={CalendarDays} />
        <MetricCard title="Pending" value={pendingBookings} icon={Clock} />
        <MetricCard title="Saved" value={savedCount} icon={Heart} />
        <MetricCard title="Reviews" value={reviewCount} icon={Star} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => {
                const restaurant = booking.restaurantId as { name: string; slug: string };
                return (
                  <div key={String(booking._id)} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                    <div>
                      <Link href={`/restaurants/${restaurant?.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {restaurant?.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(booking.bookingDate)} · {booking.bookingTime} · {booking.peopleCount} guests
                      </p>
                    </div>
                    <BookingStatusBadge status={booking.status as IBooking["status"]} />
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
