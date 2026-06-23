import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import RestaurantModel from "@/models/Restaurant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/booking/BookingStatus";
import { formatDate, formatTime } from "@/lib/utils";
import { ChevronLeft, Calendar, Clock, Users, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { IBooking } from "@/types";
import { BookingActions } from "./BookingActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking Detail" };

interface PageProps { params: Promise<{ id: string }> }

export default async function OwnerBookingDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const { id } = await params;

  const booking = await BookingModel.findById(id)
    .populate("restaurantId", "name slug ownerId")
    .populate("userId", "name email phone")
    .populate("cabinId", "name privacyType capacity")
    .lean();

  if (!booking) notFound();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = booking as any;

  const restaurant = b.restaurantId as { name: string; slug: string; ownerId: { toString: () => string } };
  const customer = b.userId as { name: string; email: string; phone?: string };
  const cabin = b.cabinId as { name: string; privacyType: string; capacity: number } | null;

  if (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/owner/bookings");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/owner/bookings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to bookings
      </Link>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Booking Request</h1>
        <BookingStatusBadge status={b.status as IBooking["status"]} />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{customer?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{customer?.email}</span></div>
          {customer?.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{customer.phone}</span></div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Booking Details</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Date</p>
              <p className="font-medium">{formatDate(b.bookingDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Time</p>
              <p className="font-medium">{formatTime(b.bookingTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">Guests</p>
              <p className="font-medium">{b.peopleCount} {b.peopleCount === 1 ? "person" : "people"}</p>
            </div>
          </div>
          {cabin && (
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Requested Space</p>
                <p className="font-medium">{cabin.name} · {cabin.privacyType.replace("-", " ")}</p>
              </div>
            </div>
          )}
          {b.notes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Customer Note</p>
              <p>{b.notes}</p>
            </div>
          )}
          {b.ownerNotes && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs text-muted-foreground font-medium mb-1">Your Note</p>
              <p>{b.ownerNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {b.status === "pending" && (
        <BookingActions bookingId={id} />
      )}

      {b.status === "approved" && (
        <BookingActions bookingId={id} approved />
      )}
    </div>
  );
}
