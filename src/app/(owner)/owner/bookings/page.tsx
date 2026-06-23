export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import BookingModel from "@/models/Booking";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/common/EmptyState";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import type { IBooking } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking Requests" };

export default async function OwnerBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();

  const myRestaurants = await RestaurantModel.find({ ownerId: session.user.id }).select("_id").lean();
  const restaurantIds = myRestaurants.map((r) => r._id);

  const bookings = await BookingModel.find({ restaurantId: { $in: restaurantIds } })
    .populate("restaurantId", "name slug")
    .populate("userId", "name email phone")
    .populate("cabinId", "name")
    .sort({ createdAt: -1 })
    .lean();

  const pending = bookings.filter((b) => b.status === "pending");
  const others = bookings.filter((b) => b.status !== "pending");

  const renderBooking = (booking: (typeof bookings)[0]) => {
    const restaurant = booking.restaurantId as { name: string; slug: string };
    const customer = booking.userId as { name: string; email: string; phone?: string };
    const cabin = booking.cabinId as { name: string } | null;

    return (
      <Card key={String(booking._id)}>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{customer?.name}</p>
                <span className="text-muted-foreground text-sm">at {restaurant?.name}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-muted-foreground">
                <span>{formatDate(booking.bookingDate)}</span>
                <span>{formatTime(booking.bookingTime)}</span>
                <span>{booking.peopleCount} guests</span>
                {cabin && <span>· {cabin.name}</span>}
              </div>
              {booking.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Note: </span>{booking.notes}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{customer?.email}{customer?.phone ? ` · ${customer.phone}` : ""}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <BookingStatusBadge status={booking.status as IBooking["status"]} />
              <Button size="sm" variant="outline" asChild>
                <Link href={`/owner/bookings/${booking._id}`}>
                  {booking.status === "pending" ? "Review" : "View"}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Booking Requests</h1>

      {bookings.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No bookings yet" description="Booking requests will appear here once customers start reserving." />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                Pending Review
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold">
                  {pending.length}
                </span>
              </h2>
              <div className="space-y-3">{pending.map(renderBooking)}</div>
            </div>
          )}
          {others.length > 0 && (
            <div>
              <h2 className="text-base font-semibold mb-3 text-muted-foreground">Past Requests</h2>
              <div className="space-y-3">{others.map(renderBooking)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
