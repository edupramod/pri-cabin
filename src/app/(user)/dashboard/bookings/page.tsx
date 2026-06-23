export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";
import type { IBooking } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Bookings" };

export default async function UserBookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const bookings = await BookingModel.find({ userId: session.user.id })
    .populate("restaurantId", "name slug photos city")
    .populate("cabinId", "name privacyType")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} total</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="Find a restaurant and make your first reservation."
          action={<Button asChild><Link href="/restaurants">Browse Restaurants</Link></Button>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const restaurant = booking.restaurantId as { name: string; slug: string; photos: string[]; city: string };
            const cabin = booking.cabinId as { name: string; privacyType: string } | null;

            return (
              <Card key={String(booking._id)}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      {restaurant?.photos?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={restaurant.photos[0]}
                          alt={restaurant.name}
                          className="h-16 w-16 rounded-md object-cover shrink-0 hidden sm:block"
                        />
                      )}
                      <div>
                        <Link
                          href={`/restaurants/${restaurant?.slug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {restaurant?.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{restaurant?.city}</p>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>{formatDate(booking.bookingDate)}</span>
                          <span>{formatTime(booking.bookingTime)}</span>
                          <span>{booking.peopleCount} guest{booking.peopleCount !== 1 ? "s" : ""}</span>
                          {cabin && <span>{cabin.name}</span>}
                        </div>
                        {booking.ownerNotes && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Restaurant note: </span>{booking.ownerNotes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      <BookingStatusBadge status={booking.status as IBooking["status"]} />
                      {booking.status === "pending" && (
                        <CancelButton bookingId={String(booking._id)} />
                      )}
                      {booking.status === "completed" && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/reviews?bookingId=${booking._id}`}>Write Review</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Client component for cancel
import { CancelBookingButton as CancelButton } from "./CancelBookingButton";
