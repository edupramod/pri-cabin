import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { RestaurantForm } from "@/features/restaurants/RestaurantForm";
import type { Metadata } from "next";

interface PageProps { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: "Edit Restaurant" };

export default async function EditRestaurantPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const { id } = await params;
  const restaurant = await RestaurantModel.findById(id).lean() as any;
  if (!restaurant) notFound();

  if (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin") {
    redirect("/owner/restaurants");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = restaurant as any;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Edit Restaurant</h1>
      <RestaurantForm
        restaurantId={id}
        defaultValues={{
          name: r.name,
          description: r.description,
          address: r.address,
          city: r.city,
          phone: r.phone,
          priceRange: r.priceRange,
          amenities: r.amenities,
          openingHours: r.openingHours,
          photos: r.photos,
        }}
      />
    </div>
  );
}
