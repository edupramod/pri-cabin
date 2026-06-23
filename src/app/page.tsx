export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import CabinModel from "@/models/Cabin";
import ReviewModel from "@/models/Review";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero } from "@/components/home/HomeHero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedCabins } from "@/components/home/FeaturedCabins";
import { Testimonials } from "@/components/home/Testimonials";
import { SpecialEvents } from "@/components/home/SpecialEvents";
import { HomeFooter } from "@/components/home/HomeFooter";
import type { IRestaurant, ICabin, IReview } from "@/types";

async function getHomeData() {
  await connectDB();

  const [restaurants, recentReviews] = await Promise.all([
    RestaurantModel.find({ verified: "verified" })
      .sort({ averageRating: -1, viewCount: -1 })
      .limit(3)
      .lean(),
    ReviewModel.find({})
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  // Fetch cabins for those restaurants
  const restaurantIds = restaurants.map((r) => r._id);
  const cabins = await CabinModel.find({
    restaurantId: { $in: restaurantIds },
    active: true,
  })
    .limit(9)
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = (docs: any[]) =>
    docs.map((doc) => ({
      ...doc,
      _id: doc._id?.toString(),
      ownerId: doc.ownerId?.toString(),
      restaurantId: doc.restaurantId?.toString(),
      userId: doc.userId
        ? { ...doc.userId, _id: doc.userId._id?.toString() }
        : doc.userId?.toString?.() ?? doc.userId,
      bookingId: doc.bookingId?.toString?.() ?? doc.bookingId,
    }));

  return {
    restaurants: serialize(restaurants) as unknown as IRestaurant[],
    cabins: serialize(cabins) as unknown as ICabin[],
    reviews: serialize(recentReviews) as unknown as IReview[],
  };
}

export default async function HomePage() {
  const { restaurants, cabins, reviews } = await getHomeData();

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <HomeHeader />
      <HomeHero />
      <WhyChooseUs />
      <FeaturedCabins restaurants={restaurants} cabins={cabins} />
      <Testimonials reviews={reviews} />
      <SpecialEvents />
      <HomeFooter />
    </div>
  );
}
