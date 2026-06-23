import { z } from "zod";

const openingHourSchema = z.object({
  day: z.string(),
  open: z.string().optional(),
  close: z.string().optional(),
  closed: z.boolean().default(false),
});

export const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  address: z.string().min(5, "Address is required"),
  city: z.string().default("Pokhara"),
  phone: z.string().min(7, "Phone number is required"),
  priceRange: z.coerce.number().int().min(1).max(4).default(2),
  amenities: z.object({
    parking: z.boolean().default(false),
    wifi: z.boolean().default(false),
    ac: z.boolean().default(false),
    familyRooms: z.boolean().default(false),
    coupleSeating: z.boolean().default(false),
  }),
  openingHours: z.array(openingHourSchema).optional(),
  photos: z.array(z.string().url()).default([]),
});

export type RestaurantInput = z.infer<typeof restaurantSchema>;
