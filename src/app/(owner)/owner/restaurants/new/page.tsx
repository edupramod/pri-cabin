import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RestaurantForm } from "@/features/restaurants/RestaurantForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Restaurant" };

export default async function NewRestaurantPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "owner" && session.user.role !== "admin") redirect("/");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Add New Restaurant</h1>
        <p className="text-muted-foreground mt-1">Your listing will go live after admin verification (usually within 24 hours).</p>
      </div>
      <RestaurantForm />
    </div>
  );
}
