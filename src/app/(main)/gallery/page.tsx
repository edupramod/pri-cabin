"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────── */
type Category = "All" | "Cabins" | "Food & Drinks" | "Events" | "Ambiance";

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  category: Exclude<Category, "All">;
};

type Moment = {
  id: number;
  label: string;
  title: string;
  desc: string;
  image: string;
  href: string;
};

/* ─── Data ───────────────────────────────────────────────── */
const CATEGORIES: Category[] = ["All", "Cabins", "Food & Drinks", "Events", "Ambiance"];

const GALLERY: GalleryItem[] = [
  /* Row 1 */
  { id: 1,  src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=900&fit=crop", alt: "Luxury cabin room",        category: "Cabins" },
  { id: 2,  src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&h=500&fit=crop", alt: "Lakeside dining terrace",  category: "Ambiance" },
  { id: 3,  src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&h=500&fit=crop", alt: "Restaurant interior",      category: "Ambiance" },
  /* Row 2 */
  { id: 4,  src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=460&fit=crop", alt: "Gourmet bowl",             category: "Food & Drinks" },
  { id: 5,  src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=460&fit=crop",    alt: "Chef chopping herbs",      category: "Food & Drinks" },
  { id: 6,  src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=460&fit=crop", alt: "Coffee latte art",         category: "Food & Drinks" },
  /* Row 3 */
  { id: 7,  src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&h=460&fit=crop",    alt: "Private event hall",       category: "Events" },
  { id: 8,  src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=460&fit=crop", alt: "Plated gourmet dish",      category: "Food & Drinks" },
  { id: 9,  src: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=600&h=460&fit=crop",    alt: "Elegant lounge interior",  category: "Ambiance" },
];

const MOMENTS: Moment[] = [
  {
    id: 1,
    label: "Birthday",
    title: "Birthday Packages",
    desc: "Memorable celebrations with custom décor, candlelight, and curated menus.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=360&fit=crop",
    href: "/restaurants",
  },
  {
    id: 2,
    label: "Anniversary",
    title: "Anniversary Celebrations",
    desc: "Romantic private dining for two with elegant service and intimate ambiance.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=360&fit=crop",
    href: "/restaurants",
  },
  {
    id: 3,
    label: "Corporate",
    title: "Corporate Meetings",
    desc: "Professional spaces with privacy, premium service, and seamless hosting.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=360&fit=crop",
    href: "/restaurants",
  },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function GalleryPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <div className="mx-auto max-w-5xl px-4 md:px-6 pt-14 pb-20">

        {/* ── Heading ── */}
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-3">
            Visual Journey
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            A Glimpse Into Our World
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
            Discover the atmosphere, cuisine, and private moments that define the LumièreCabins experience.
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-white/20" />
        </div>

        {/* ── Category pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                active === cat
                  ? "bg-white text-black font-semibold"
                  : "border border-white/12 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Gallery grid ── */}
        {active === "All" ? (
          <div className="space-y-1">
            {/* Row 1 — tall left (1/3) + stacked right (2/3) */}
            <div className="grid grid-cols-3 gap-1">
              {/* Tall left — spans 2 rows */}
              <div className="relative rounded-lg overflow-hidden" style={{ height: "421px" }}>
                <Image
                  src={GALLERY[0].src}
                  alt={GALLERY[0].alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              {/* Top-right wide (2 col) */}
              <div className="col-span-2 relative rounded-lg overflow-hidden h-52">
                <Image
                  src={GALLERY[1].src}
                  alt={GALLERY[1].alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              {/* Bottom-right wide (2 col) — needs margin-top to sit below top-right */}
              <div className="col-span-2 relative rounded-lg overflow-hidden h-[205px] mt-1">
                <Image
                  src={GALLERY[2].src}
                  alt={GALLERY[2].alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            </div>

            {/* Row 2 — 3 equal */}
            <div className="grid grid-cols-3 gap-1 mt-1">
              {GALLERY.slice(3, 6).map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden h-[200px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            {/* Row 3 — 3 equal */}
            <div className="grid grid-cols-3 gap-1 mt-1">
              {GALLERY.slice(6, 9).map((item) => (
                <div key={item.id} className="relative rounded-lg overflow-hidden h-[200px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Filtered — uniform grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
            {filtered.map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden h-[200px]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-3 py-16 text-center text-sm text-white/30">
                No photos in this category yet.
              </p>
            )}
          </div>
        )}

        {/* ── Featured Moments ── */}
        <div className="mt-16">
          <div className="text-center mb-7">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-2">
              Featured Moments
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Celebrate in Style
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MOMENTS.map((m) => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#141414] flex flex-col"
              >
                {/* Photo */}
                <div className="relative h-[140px] overflow-hidden">
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Label pill — top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur-sm">
                      {m.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-white text-[13px] mb-1.5">{m.title}</h3>
                  <p className="text-[11px] text-white/42 leading-relaxed flex-1 mb-3">{m.desc}</p>
                  <Link
                    href={m.href}
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="mt-12 relative rounded-2xl overflow-hidden min-h-[220px]">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&h=500&fit=crop"
            alt="Create your perfect moment"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Left-heavy gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />

          <div className="relative z-10 flex flex-col justify-center min-h-[220px] p-8 md:p-10">
            <h2 className="text-2xl md:text-[1.75rem] font-semibold text-white mb-2 leading-tight">
              Create Your Perfect Moment
            </h2>
            <p className="text-[13px] text-white/50 mb-6 max-w-xs leading-relaxed">
              Reserve a private cabin and turn any evening into something unforgettable.
            </p>
            <Link
              href="/restaurants"
              className="inline-flex w-fit items-center rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Book Your Cabin
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
