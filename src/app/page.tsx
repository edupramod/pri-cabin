export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { RestaurantGrid } from "@/components/restaurant/RestaurantGrid";
import { Button } from "@/components/ui/button";
import { Search, Star, Lock, Calendar } from "lucide-react";
import type { IRestaurant } from "@/types";

async function getHomeData() {
  await connectDB();
  const [featured, topRated, recent] = await Promise.all([
    RestaurantModel.find({ verified: "verified", featured: true }).limit(3).lean(),
    RestaurantModel.find({ verified: "verified" }).sort({ averageRating: -1 }).limit(6).lean(),
    RestaurantModel.find({ verified: "verified" }).sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  // Serialize all ObjectIds to strings so they can cross the server→client boundary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = (docs: any[]) =>
    docs.map((doc) => ({
      ...doc,
      _id: doc._id?.toString(),
      ownerId: doc.ownerId?.toString(),
    }));

  return {
    featured: serialize(featured),
    topRated: serialize(topRated),
    recent: serialize(recent),
  };
}
export default async function HomePage() {
  const { featured, topRated, recent } = await getHomeData();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative bg-slate-900 py-24 md:py-36">
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-950" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-6">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Pokhara&apos;s private dining directory
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl md:text-6xl leading-tight text-balance">
            Find Your Perfect<br />Private Dining Experience
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Discover restaurants with private cabins, couple-friendly spaces, and family rooms across Pokhara.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/restaurants">
                <Search className="h-4 w-4" />
                Browse Restaurants
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20" asChild>
              <Link href="/restaurants?coupleSeating=true">Couple Dining</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Search, title: "Discover", desc: "Browse verified restaurants with private dining options in Pokhara." },
              { icon: Calendar, title: "Book", desc: "Submit booking requests directly to restaurant owners." },
              { icon: Lock, title: "Privacy", desc: "From semi-private cabins to fully enclosed family rooms." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 space-y-16">
          {/* Featured */}
          {featured.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Featured Restaurants</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Hand-picked private dining experiences</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/restaurants?featured=true">View all</Link>
                </Button>
              </div>
              <RestaurantGrid restaurants={featured as unknown as IRestaurant[]} />
            </section>
          )}

          {/* Top Rated */}
          {topRated.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Top Rated</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Loved by our customers</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/restaurants?sort=rating">View all</Link>
                </Button>
              </div>
              <RestaurantGrid restaurants={topRated as unknown as IRestaurant[]} />
            </section>
          )}

          {/* Recently Added */}
          {recent.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Recently Added</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">New listings on the platform</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/restaurants?sort=newest">View all</Link>
                </Button>
              </div>
              <RestaurantGrid restaurants={recent as unknown as IRestaurant[]} />
            </section>
          )}

          {/* CTA */}
          <section className="rounded-xl border bg-muted/40 p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold">Own a Restaurant?</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              List your private dining spaces and start receiving bookings from customers looking for exactly what you offer.
            </p>
            <Button className="mt-6" size="lg" asChild>
              <Link href="/register?role=owner">List Your Restaurant</Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
