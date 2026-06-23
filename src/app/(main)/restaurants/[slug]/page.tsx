export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import type { IRestaurantDocument } from "@/models/Restaurant";
import CabinModel from "@/models/Cabin";
import type { ICabinDocument } from "@/models/Cabin";
import ReviewModel from "@/models/Review";
import type { IReviewDocument } from "@/models/Review";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/review/StarRating";
import { ReviewCard } from "@/components/review/ReviewCard";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import {
  MapPin, Phone, Clock, Wifi, Car, Wind, Users, Lock, Home,
  Star, Eye, ChevronRight
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import type { IReview } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

type LeanRestaurant = Omit<IRestaurantDocument, keyof Document> & { _id: string };
type LeanCabin = Omit<ICabinDocument, keyof Document> & { _id: string };

const PRIVACY_LABELS: Record<string, string> = {
  "open": "Open Seating",
  "semi-private": "Semi-Private",
  "fully-private": "Fully Private",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const { slug } = await params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = await RestaurantModel.findOne({ slug }).lean() as any;
  if (!restaurant) return { title: "Not Found" };
  return {
    title: restaurant.name,
    description: (restaurant.description as string).slice(0, 155),
    openGraph: {
      title: restaurant.name,
      description: (restaurant.description as string).slice(0, 155),
      images: restaurant.photos?.[0] ? [{ url: restaurant.photos[0] }] : [],
    },
  };
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  await connectDB();
  const { slug } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const restaurant = await RestaurantModel.findOne({ slug }).lean() as any;
  if (!restaurant || restaurant.verified !== "verified") notFound();

  const [cabins, reviews] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CabinModel.find({ restaurantId: restaurant._id, active: true }).lean() as Promise<any[]>,
    ReviewModel.find({ restaurantId: restaurant._id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .lean() as Promise<any[]>,
  ]);

  // Increment view count async
  RestaurantModel.findByIdAndUpdate(restaurant._id, { $inc: { viewCount: 1 } }).exec().catch(() => {});

  const amenities = [
    restaurant.amenities?.wifi && { icon: Wifi, label: "WiFi" },
    restaurant.amenities?.parking && { icon: Car, label: "Parking" },
    restaurant.amenities?.ac && { icon: Wind, label: "Air Conditioning" },
    restaurant.amenities?.familyRooms && { icon: Home, label: "Family Rooms" },
    restaurant.amenities?.coupleSeating && { icon: Users, label: "Couple Seating" },
  ].filter(Boolean) as { icon: React.ElementType; label: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      addressLocality: restaurant.city,
      addressCountry: "NP",
    },
    telephone: restaurant.phone,
    aggregateRating: restaurant.totalReviews > 0
      ? { "@type": "AggregateRating", ratingValue: restaurant.averageRating, reviewCount: restaurant.totalReviews }
      : undefined,
  };

  const id = String(restaurant._id);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/restaurants" className="hover:text-foreground">Restaurants</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate">{restaurant.name}</span>
        </nav>

        {/* Gallery */}
        {restaurant.photos?.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 rounded-xl overflow-hidden">
            {(restaurant.photos as string[]).slice(0, 5).map((photo: string, i: number) => (
              <div
                key={i}
                className={`relative aspect-[4/3] bg-muted ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <Image
                  src={photo}
                  alt={`${restaurant.name} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,320px]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {restaurant.address}, {restaurant.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />{restaurant.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />{restaurant.viewCount} views
                    </span>
                  </div>
                </div>
                <FavoriteButton restaurantId={id} />
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                {restaurant.totalReviews > 0 ? (
                  <>
                    <StarRating rating={restaurant.averageRating} size="md" />
                    <span className="font-semibold">{restaurant.averageRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({restaurant.totalReviews} reviews)</span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">No reviews yet</span>
                )}
                {restaurant.amenities?.coupleSeating && (
                  <Badge variant="secondary">Couple Friendly</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Amenities</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {amenities.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-lg border p-3 text-sm">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Private Cabins */}
            {cabins.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Private Spaces ({cabins.length})</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cabins.map((cabin) => (
                    <div key={String(cabin._id)} className="rounded-lg border p-4">
                      {cabin.photos?.[0] && (
                        <div className="relative aspect-[16/9] rounded-md overflow-hidden mb-3">
                          <Image
                            src={cabin.photos[0]}
                            alt={cabin.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium">{cabin.name}</h3>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Lock className="h-3 w-3" />
                          {PRIVACY_LABELS[cabin.privacyType] ?? cabin.privacyType}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        Up to {cabin.capacity} guests
                      </div>
                      {cabin.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{cabin.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Opening Hours */}
            {restaurant.openingHours?.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Opening Hours
                </h2>
                <div className="grid gap-1.5">
                  {(restaurant.openingHours as Array<{ day: string; open: string; close: string; closed: boolean }>).map((hour) => (
                    <div key={hour.day} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                      <span className="font-medium w-28">{hour.day}</span>
                      <span className="text-muted-foreground">
                        {hour.closed
                          ? "Closed"
                          : `${formatTime(hour.open || "09:00")} – ${formatTime(hour.close || "21:00")}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Reviews ({restaurant.totalReviews})</h2>
              </div>
              {reviews.length > 0 ? (
                <div>
                  {reviews.map((review) => (
                    <ReviewCard key={String(review._id)} review={review as unknown as IReview} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No reviews yet. Be the first to review after your visit!
                </p>
              )}
            </div>
          </div>

          {/* Right column — Booking CTA */}
          <aside>
            <div className="sticky top-24 rounded-xl border p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Book a Table</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Request a reservation at {restaurant.name}
                </p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                {cabins.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4 text-primary" />
                    {cabins.length} private space{cabins.length !== 1 ? "s" : ""} available
                  </div>
                )}
                {amenities.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href={`/restaurants/${slug}/book`}>Reserve Now</Link>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Free to book · Confirmation within 24 hours
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
