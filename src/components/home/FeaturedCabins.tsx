import Link from "next/link";
import Image from "next/image";
import { Users, ArrowRight } from "lucide-react";
import type { IRestaurant, ICabin } from "@/types";

interface FeaturedCabinsProps {
  restaurants: IRestaurant[];
  cabins: ICabin[];
}

// Static showcase cabins matching the design exactly
const STATIC_CABINS = [
  {
    id: "1",
    name: "The Imperial Cabin",
    slug: "the-imperial-cabin",
    guests: "2–6",
    priceMin: 120,
    priceMax: 260,
    typeLabel: "Skyline View",
    tags: ["Skyline View", "Private Bar", "Chef Service"],
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=420&fit=crop",
  },
  {
    id: "2",
    name: "The Velvet Booth",
    slug: "the-velvet-booth",
    guests: "2–4",
    priceMin: 90,
    priceMax: 180,
    typeLabel: "Romantic",
    tags: ["Romantic", "Candlelit", "Quiet Corner"],
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=420&fit=crop",
  },
  {
    id: "3",
    name: "The Grand Suite",
    slug: "the-grand-suite",
    guests: "6–12",
    priceMin: 200,
    priceMax: 480,
    typeLabel: "Premium",
    tags: ["Group Events", "Premium", "Large Table"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=420&fit=crop",
  },
];

export function FeaturedCabins({ restaurants, cabins }: FeaturedCabinsProps) {
  // Try to build real cabin cards if data exists, otherwise use static
  const hasCabins = cabins.length > 0;
  const restaurantMap = new Map(restaurants.map((r) => [r._id, r]));

  const displayItems = hasCabins
    ? cabins.slice(0, 3).map((cabin, i) => {
        const restaurant =
          typeof cabin.restaurantId === "string"
            ? restaurantMap.get(cabin.restaurantId)
            : undefined;
        const photo =
          cabin.photos?.[0] ||
          restaurant?.photos?.[0] ||
          STATIC_CABINS[i % 3].image;
        return {
          id: cabin._id as string,
          name: cabin.name,
          slug: restaurant?.slug ?? "restaurants",
          guests: `1–${cabin.capacity}`,
          priceMin: restaurant?.priceRange ? restaurant.priceRange * 60 : 90,
          priceMax: restaurant?.priceRange ? restaurant.priceRange * 130 : 180,
          typeLabel:
            cabin.privacyType === "fully-private"
              ? "Fully Private"
              : cabin.privacyType === "semi-private"
              ? "Semi Private"
              : "Open",
          tags: [
            cabin.privacyType === "fully-private" ? "Private" : "Semi-Private",
            restaurant?.amenities?.coupleSeating ? "Romantic" : "Family",
            restaurant?.amenities?.ac ? "AC" : "Cozy",
          ],
          image: photo,
        };
      })
    : STATIC_CABINS;

  return (
    <section className="bg-[#111111] py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">
              Featured Cabin
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Our Signature Private Spaces
            </h2>
          </div>
          <Link
            href="/restaurants"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/55 hover:text-white hover:border-white/30 transition-colors"
          >
            View All Cabins
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 3-col cabin grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((cabin) => (
            <Link
              key={cabin.id}
              href={`/restaurants/${cabin.slug}`}
              className="group block rounded-xl overflow-hidden border border-white/8 bg-[#141414] hover:border-white/20 transition-all"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={cabin.image}
                  alt={cabin.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Type badge bottom-left */}
                <div className="absolute bottom-3 left-3">
                  <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                    {cabin.typeLabel}
                  </span>
                </div>
                {/* Guest count top-right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/70 backdrop-blur-sm">
                  <Users className="h-3 w-3" strokeWidth={1.5} />
                  {cabin.guests}
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-2">{cabin.name}</h3>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cabin.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/45"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    ${cabin.priceMin} – ${cabin.priceMax}
                  </span>
                  <span className="rounded-lg border border-white/15 bg-transparent px-3 py-1 text-xs text-white/60 group-hover:border-white/30 group-hover:text-white transition-colors">
                    Reserve Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2 text-sm text-white/55"
          >
            View All Cabins <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
