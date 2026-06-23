import { z } from "zod";

export const cabinSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  description: z.string().max(500).default(""),
  privacyType: z.enum(["open", "semi-private", "fully-private"]),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1").max(50),
  photos: z.array(z.string().url()).default([]),
  active: z.boolean().default(true),
});

export const bookingSchema = z.object({
  restaurantId: z.string().min(1, "Restaurant is required"),
  cabinId: z.string().optional(),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  peopleCount: z.coerce.number().int().min(1, "At least 1 person required").max(50),
  notes: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1, "Booking reference is required"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000),
  photos: z.array(z.string().url()).default([]),
});

export type CabinInput = z.infer<typeof cabinSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
