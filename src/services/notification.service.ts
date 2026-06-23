import { connectDB } from "@/lib/db";
import NotificationModel from "@/models/Notification";

export async function createNotification({
  userId,
  title,
  message,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  link?: string;
}) {
  await connectDB();
  return NotificationModel.create({ userId, title, message, link });
}

export async function notifyBookingReceived(ownerId: string, restaurantName: string, bookingId: string) {
  return createNotification({
    userId: ownerId,
    title: "New Booking Request",
    message: `You have a new booking request for ${restaurantName}.`,
    link: `/owner/bookings/${bookingId}`,
  });
}

export async function notifyBookingStatusChanged(
  userId: string,
  status: "approved" | "rejected",
  restaurantName: string,
  bookingId: string
) {
  const title = status === "approved" ? "Booking Approved!" : "Booking Update";
  const message =
    status === "approved"
      ? `Your booking at ${restaurantName} has been approved.`
      : `Your booking request at ${restaurantName} was not approved this time.`;

  return createNotification({
    userId,
    title,
    message,
    link: `/dashboard/bookings`,
  });
}
