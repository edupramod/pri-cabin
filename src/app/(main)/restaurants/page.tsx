"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Search, UtensilsCrossed } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type Category = "All" | "Romantic" | "Family" | "Corporate" | "Premium";

type Cabin = {
  id: number;
  name: string;
  slug: string;
  category: Exclude<Category, "All">;
  priceTier: string;   // top-right badge: "$$$"
  typeLabel: string;   // bottom-left badge on photo
  guests: string;      // "2–6"
  tags: string[];
  priceMin: number;
  priceMax: number;
  image: string;
};

/* ─── Data ───────────────────────────────────────────────── */
const CATEGORIES: Category[] = ["All", "Romantic", "Family", "Corporate", "Premium"];

const CABINS: Cabin[] = [
  {
    id: 1,
    name: "The Imperial Cabin",
    slug: "the-imperial-cabin",
    category: "Premium",
    priceTier: "$$$",
    typeLabel: "Skyline View",
    guests: "2–6",
    tags: ["Skyline View", "Private Bar", "Chef Service"],
    priceMin: 120,
    priceMax: 260,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=500&fit=crop",
  },
  {
    id: 2,
    name: "The Velvet Booth",
    slug: "the-velvet-booth",
    category: "Romantic",
    priceTier: "$$",
    typeLabel: "Romantic",
    guests: "2–4",
    tags: ["Romantic", "Candlelit", "Quiet Corner"],
    priceMin: 90,
    priceMax: 180,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=500&fit=crop",
  },
  {
    id: 3,
    name: "The Grand Suite",
    slug: "the-grand-suite",
    category: "Premium",
    priceTier: "$$$",
    typeLabel: "Premium",
    guests: "6–12",
    tags: ["Group Events", "Premium", "Large Table"],
    priceMin: 200,
    priceMax: 480,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=500&fit=crop",
  },
  {
    id: 4,
    name: "The Garden Alcove",
    slug: "the-garden-alcove",
    category: "Family",
    priceTier: "$$",
    typeLabel: "Family",
    guests: "4–8",
    tags: ["Garden View", "Family", "Kids Friendly"],
    priceMin: 110,
    priceMax: 220,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=500&fit=crop",
  },
  {
    id: 5,
    name: "The Skyline Loft",
    slug: "the-skyline-loft",
    category: "Corporate",
    priceTier: "$$$",
    typeLabel: "Corporate",
    guests: "8–14",
    tags: ["Corporate", "Projector", "Private Entry"],
    priceMin: 180,
    priceMax: 360,
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=500&fit=crop",
  },
  {
    id: 6,
    name: "The Ember Den",
    slug: "the-ember-den",
    category: "Romantic",
    priceTier: "$$",
    typeLabel: "Romantic",
    guests: "2–4",
    tags: ["Fireplace", "Romantic", "Cozy Booth"],
    priceMin: 95,
    priceMax: 190,
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=500&fit=crop",
  },
  {
    id: 7,
    name: "The Crystal Room",
    slug: "the-crystal-room",
    category: "Premium",
    priceTier: "$$$",
    typeLabel: "Premium",
    guests: "4–10",
    tags: ["Crystal Décor", "Premium", "Wine Cellar"],
    priceMin: 150,
    priceMax: 320,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=500&fit=crop",
  },
  {
    id: 8,
    name: "The Patio Suite",
    slug: "the-patio-suite",
    category: "Family",
    priceTier: "$$",
    typeLabel: "Family",
    guests: "6–14",
    tags: ["Open Patio", "Family", "BBQ Setup"],
    priceMin: 130,
    priceMax: 280,
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=600&h=500&fit=crop",
  },
];

/* ─── Cabin Card ─────────────────────────────────────────── */
function CabinCard({ cabin }: { cabin: Cabin }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#141414] flex flex-col">
      {/* ── Photo ── */}
      <div className="relative h-[178px] overflow-hidden">
        <Image
          src={cabin.image}
          alt={cabin.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Type label — bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
            {cabin.typeLabel}
          </span>
        </div>
        {/* Price tier — top right */}
        <div className="absolute top-3 right-3">
          <span className="rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm">
            {cabin.priceTier}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
        {/* Name + guest count */}
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-semibold text-white text-[13px] leading-tight">{cabin.name}</h3>
          <div className="flex items-center gap-1 text-[11px] text-white/40 shrink-0">
            <Users className="h-3 w-3" strokeWidth={1.5} />
            {cabin.guests}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {cabin.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/45"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Reserve button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[13px] font-semibold text-white">
            ${cabin.priceMin} – ${cabin.priceMax}
          </span>
          <Link
            href="/contact"
            className="rounded-md border border-white/25 bg-transparent px-4 py-1.5 text-[11px] font-medium text-white hover:bg-white/8 transition-colors"
          >
            Reserve Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CabinsPage() {
  const [active, setActive]           = useState<Category>("All");
  const [guests, setGuests]           = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = CABINS.filter((c) => active === "All" || c.category === active);
  const visible  = filtered.slice(0, visibleCount);
  const hasMore  = visibleCount < filtered.length;

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <div className="mx-auto max-w-5xl px-4 md:px-6 pt-12 pb-20">

        {/* ── Section heading ── */}
        <div className="mb-8">
          {/* Pill badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45">
            <UtensilsCrossed className="h-3 w-3" strokeWidth={1.5} />
            Our Spaces
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3 leading-tight">
            Explore Our Private Cabins
          </h1>

          {/* White underline accent */}
          <div className="mb-4 h-px w-16 bg-white/30" />

          <p className="text-sm text-white/45 max-w-sm leading-relaxed">
            Discover intimate, beautifully designed spaces for romantic dinners, family gatherings,
            and premium celebrations.
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {/* Category pills */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActive(cat); setVisibleCount(6); }}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                active === cat
                  ? "bg-white text-black font-semibold"
                  : "border border-white/12 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Push right */}
          <div className="flex-1" />

          {/* Guests + Check Availability — single pill container */}
          <div className="flex items-center rounded-full border border-white/12 bg-[#141414] overflow-hidden">
            {/* Guests input */}
            <div className="flex items-center gap-2 px-4 py-2">
              <Users className="h-3.5 w-3.5 text-white/35 shrink-0" strokeWidth={1.5} />
              <input
                type="number"
                min={1}
                placeholder="Guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-14 bg-transparent text-sm text-white placeholder-white/30 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            {/* Divider */}
            <div className="h-5 w-px bg-white/10" />
            {/* Check Availability */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white transition-colors">
              <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              Check Availability
            </button>
          </div>
        </div>

        {/* ── 3-col cabin grid ── */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((cabin) => (
              <CabinCard key={cabin.id} cabin={cabin} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-white/35 text-sm">
            No cabins found for this category.
          </div>
        )}

        {/* ── Load More ── */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((v) => v + 6)}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              Load More Cabins
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
