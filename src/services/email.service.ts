import { resend, FROM_EMAIL } from "@/lib/resend";

export async function sendBookingConfirmedEmail({
  to,
  userName,
  restaurantName,
  bookingDate,
  bookingTime,
  peopleCount,
}: {
  to: string;
  userName: string;
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  peopleCount: number;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking Request Received — ${restaurantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Hi ${userName},</h2>
        <p>Your booking request has been received and is pending confirmation.</p>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Restaurant</td><td style="padding:8px;border:1px solid #e2e8f0;">${restaurantName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Date</td><td style="padding:8px;border:1px solid #e2e8f0;">${bookingDate}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Time</td><td style="padding:8px;border:1px solid #e2e8f0;">${bookingTime}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Guests</td><td style="padding:8px;border:1px solid #e2e8f0;">${peopleCount}</td></tr>
        </table>
        <p>The restaurant owner will review your request. You'll be notified once it's confirmed.</p>
        <p>— Private Dining Pokhara</p>
      </div>
    `,
  });
}

export async function sendBookingApprovedEmail({
  to,
  userName,
  restaurantName,
  bookingDate,
  bookingTime,
  ownerNotes,
}: {
  to: string;
  userName: string;
  restaurantName: string;
  bookingDate: string;
  bookingTime: string;
  ownerNotes?: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking Confirmed — ${restaurantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Great news, ${userName}!</h2>
        <p>Your booking at <strong>${restaurantName}</strong> has been confirmed for ${bookingDate} at ${bookingTime}.</p>
        ${ownerNotes ? `<p><strong>Note from restaurant:</strong> ${ownerNotes}</p>` : ""}
        <p>We look forward to seeing you. Enjoy your private dining experience!</p>
        <p>— Private Dining Pokhara</p>
      </div>
    `,
  });
}

export async function sendBookingRejectedEmail({
  to,
  userName,
  restaurantName,
}: {
  to: string;
  userName: string;
  restaurantName: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Booking Update — ${restaurantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Hi ${userName},</h2>
        <p>Unfortunately, your booking request at <strong>${restaurantName}</strong> could not be accommodated at this time.</p>
        <p>You can try another date or explore other restaurants on Private Dining Pokhara.</p>
        <p>— Private Dining Pokhara</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ to, name }: { to: string; name: string }) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Welcome to Private Dining Pokhara",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Welcome, ${name}!</h2>
        <p>You've joined Private Dining Pokhara — the best way to discover and book private dining experiences in the city.</p>
        <p>Start exploring restaurants with private cabins, couple-friendly spaces, and family rooms.</p>
        <p>— Private Dining Pokhara</p>
      </div>
    `,
  });
}

export async function sendRestaurantVerifiedEmail({
  to,
  ownerName,
  restaurantName,
}: {
  to: string;
  ownerName: string;
  restaurantName: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Restaurant Verified — ${restaurantName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h2>Hi ${ownerName},</h2>
        <p><strong>${restaurantName}</strong> has been verified and is now live on Private Dining Pokhara.</p>
        <p>Customers can now discover and book your restaurant.</p>
        <p>— Private Dining Pokhara</p>
      </div>
    `,
  });
}
