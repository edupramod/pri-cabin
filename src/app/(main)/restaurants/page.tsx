export const dynamic = "force-dynamic";
import { Suspense } from "react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { RestaurantFilters } from "@/components/restaurant/RestaurantFilters";
import { RestaurantSearch } from "@/components/restaurant/RestaurantSearch";
import { Pagination } from "@/components/common/Pagination";
import { RestaurantGridSkeleton } from "@/components/common/LoadingSkeleton";
import type { IRestaurant, RestaurantFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Browse all private dining restaurants in Pokhara. Filter by amenities, price, and more.",
};

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

async function RestaurantResults({ searchParams }: { searchParams: Record<string, string> }) {
  await connectDB();

  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = { verified: "verified" };

  if (searchParams.search) query.$text = { $search: searchParams.search };
  if (searchParams.city) query.city = searchParams.city;
  if (searchParams.featured === "true") query.featured = true;

  ["parking", "wifi", "ac", "familyRooms", "coupleSeating"].forEach((a) => {
    if (searchParams[a] === "true") query[`amenities.${a}`] = true;
  });

  if (searchParams.priceRange) query.priceRange = parseInt(searchParams.priceRange);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortMap: Record<string, any> = {
    rating: { averageRating: -1 },
    popular: { viewCount: -1 },
    newest: { createdAt: -1 },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sort: any = sortMap[searchParams.sort || "newest"] || sortMap.newest;

  const [restaurants, total] = await Promise.all([
    RestaurantModel.find(query).sort(sort).skip(skip).limit(limit).lean(),
    RestaurantModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} restaurant{total !== 1 ? "s" : ""} found
        </p>
      </div>
      <RestaurantGrid restaurants={restaurants as unknown as IRestaurant[]} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

export default async function RestaurantsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Restaurants in Pokhara</h1>
        <p className="text-muted-foreground mt-1">Discover private dining spaces near you</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px,1fr]">
        {/* Filters sidebar */}
        <aside className="hidden lg:block">
          <Suspense fallback={null}>
            <RestaurantFilters />
          </Suspense>
        </aside>

        {/* Main content */}
        <div className="space-y-4">
          <Suspense fallback={null}>
            <RestaurantSearch />
          </Suspense>
          <Suspense fallback={<RestaurantGridSkeleton />}>
            <RestaurantResults searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
