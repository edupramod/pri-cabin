"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────── */
type Tag = {
  label: string;
  variant?: "amber" | "green" | "purple" | "default";
};

type MenuItem = {
  id: number;
  name: string;
  nameBadge?: string;         // inline badge next to name e.g. "Chef's Special"
  description: string;
  price: number;
  tags: Tag[];
  image: string;
  category: Category;
};

type Category = "Starters" | "Mains" | "Desserts" | "Beverages" | "Chef's Specials";

/* ─── Data ───────────────────────────────────────────── */
const CATEGORIES: Category[] = ["Starters", "Mains", "Desserts", "Beverages", "Chef's Specials"];

const MENU_ITEMS: MenuItem[] = [
  /* ── Mains ── */
  {
    id: 1,
    name: "Herb Butter Salmon",
    nameBadge: "Chef's Special",
    description: "Pan-seared salmon with lemon-herb butter, roasted asparagus, and silky potato purée.",
    price: 34,
    tags: [{ label: "Gluten-Free" }, { label: "Chef's Special", variant: "amber" }],
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 2,
    name: "Citrus Chicken Supreme",
    nameBadge: "Chef's Special",
    description: "Roasted chicken breast with citrus glaze, seasonal vegetables, and herb jus.",
    price: 32,
    tags: [{ label: "Gluten-Free" }, { label: "Chef's Special", variant: "amber" }],
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 3,
    name: "Truffle Ribeye",
    description: "Aged ribeye with truffle jus, charred broccoli, and smoked garlic mash.",
    price: 48,
    tags: [{ label: "Truffle-Free" }, { label: "Signature", variant: "purple" }],
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 4,
    name: "Roasted Cauliflower Bowl",
    description: "Charred cauliflower, quinoa, avocado cream, pickled onion, and toasted seeds.",
    price: 24,
    tags: [{ label: "Vegetarian" }, { label: "Vegan", variant: "green" }],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 5,
    name: "Wild Mushroom Risotto",
    description: "Creamy arborio rice with wild mushrooms, parmesan, and white wine reduction.",
    price: 28,
    tags: [{ label: "Vegetarian" }, { label: "Gluten-Free" }],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 6,
    name: "Lobster Risotto",
    description: "Creamy saffron risotto with butter-poached lobster and micro herbs.",
    price: 42,
    tags: [{ label: "Gluten-Free" }, { label: "Premium", variant: "amber" }],
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=120&h=120&fit=crop",
    category: "Mains",
  },
  {
    id: 7,
    name: "Pappardelle Bolognese",
    description: "Slow-braised beef ragù, fresh pappardelle, parmesan, and basil oil.",
    price: 29,
    tags: [{ label: "Chef's Special", variant: "amber" }, { label: "Contains Dairy" }],
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=120&h=120&fit=crop",
    category: "Mains",
  },
  /* ── Starters ── */
  {
    id: 8,
    name: "Burrata & Heirloom Tomato",
    description: "Creamy burrata, heirloom tomatoes, basil oil, and fleur de sel.",
    price: 18,
    tags: [{ label: "Vegetarian" }, { label: "Gluten-Free" }],
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=120&h=120&fit=crop",
    category: "Starters",
  },
  {
    id: 9,
    name: "Seared Scallops",
    nameBadge: "Signature",
    description: "Pan-seared scallops with cauliflower purée, crispy capers, and lemon butter.",
    price: 22,
    tags: [{ label: "Gluten-Free" }, { label: "Signature", variant: "purple" }],
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=120&h=120&fit=crop",
    category: "Starters",
  },
  {
    id: 10,
    name: "Crispy Calamari",
    description: "Lightly battered calamari rings with lemon aioli and fresh herbs.",
    price: 16,
    tags: [{ label: "Contains Gluten" }],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop",
    category: "Starters",
  },
  /* ── Desserts ── */
  {
    id: 11,
    name: "Chocolate Fondant",
    description: "Warm dark chocolate fondant with vanilla bean ice cream and salted caramel.",
    price: 14,
    tags: [{ label: "Contains Gluten" }, { label: "Contains Dairy" }],
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=120&h=120&fit=crop",
    category: "Desserts",
  },
  {
    id: 12,
    name: "Crème Brûlée",
    nameBadge: "Chef's Special",
    description: "Classic Tahitian vanilla crème brûlée with caramelised sugar crust.",
    price: 12,
    tags: [{ label: "Gluten-Free" }, { label: "Chef's Special", variant: "amber" }],
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=120&h=120&fit=crop",
    category: "Desserts",
  },
  {
    id: 13,
    name: "Mango Panna Cotta",
    description: "Silky panna cotta with fresh mango coulis and toasted coconut flakes.",
    price: 11,
    tags: [{ label: "Gluten-Free" }, { label: "Vegetarian" }],
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&h=120&fit=crop",
    category: "Desserts",
  },
  /* ── Beverages ── */
  {
    id: 14,
    name: "House Sparkling Water",
    description: "Still or sparkling, served chilled with a wedge of lemon.",
    price: 5,
    tags: [{ label: "Vegan", variant: "green" }],
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&h=120&fit=crop",
    category: "Beverages",
  },
  {
    id: 15,
    name: "Seasonal Mocktail",
    description: "Fresh seasonal fruits, house-made syrups, and sparkling water.",
    price: 9,
    tags: [{ label: "Vegan", variant: "green" }, { label: "Gluten-Free" }],
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=120&h=120&fit=crop",
    category: "Beverages",
  },
  {
    id: 16,
    name: "Cold Brew Coffee",
    description: "Slow-steeped cold brew served over ice with optional oat milk.",
    price: 7,
    tags: [{ label: "Vegan", variant: "green" }],
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=120&h=120&fit=crop",
    category: "Beverages",
  },
  /* ── Chef's Specials ── */
  {
    id: 17,
    name: "Black Truffle Tagliatelle",
    nameBadge: "Chef's Special",
    description: "Handmade pasta with black truffle cream, parmesan crisp, and a delicate herb finish.",
    price: 52,
    tags: [{ label: "Chef's Special", variant: "amber" }, { label: "Signature", variant: "purple" }],
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=120&fit=crop",
    category: "Chef's Specials",
  },
  {
    id: 18,
    name: "Wagyu Beef Tenderloin",
    nameBadge: "Premium",
    description: "Grade A5 Wagyu seared to perfection with bone marrow butter and winter truffle.",
    price: 95,
    tags: [{ label: "Premium", variant: "amber" }, { label: "Gluten-Free" }],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop",
    category: "Chef's Specials",
  },
];

/* ─── Tag chip ───────────────────────────────────────── */
function TagChip({ tag }: { tag: Tag }) {
  const variants: Record<string, string> = {
    amber:   "bg-amber-500/12 text-amber-400/80 border-amber-500/20",
    green:   "bg-emerald-500/12 text-emerald-400/80 border-emerald-500/20",
    purple:  "bg-purple-500/12 text-purple-400/80 border-purple-500/20",
    default: "bg-white/5 text-white/40 border-white/10",
  };
  const cls = variants[tag.variant ?? "default"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${cls}`}>
      {tag.label}
    </span>
  );
}

/* ─── Menu Item ──────────────────────────────────────── */
function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start gap-3.5 py-4 border-b border-white/[0.07] last:border-0">
      {/* Thumbnail */}
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
        <Image
          src={item.image}
          alt={item.name}
          width={64}
          height={64}
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="font-semibold text-white text-[13px] leading-tight">{item.name}</span>
            {item.nameBadge && (
              <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/12 px-2 py-0.5 text-[9px] font-medium text-amber-400/80 leading-none">
                {item.nameBadge}
              </span>
            )}
          </div>
          <span className="shrink-0 font-semibold text-white text-[13px] leading-tight">${item.price}</span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2 mb-2">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <TagChip key={t.label} tag={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Mains");

  const filtered = MENU_ITEMS.filter((i) => i.category === activeCategory);
  const left  = filtered.filter((_, i) => i % 2 === 0);
  const right = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      {/* ── Heading ── */}
      <section className="pt-14 pb-8 text-center px-4">
        <p className="text-[10px] tracking-[0.25em] uppercase text-white/35 mb-3">
          Culinary Experience
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
          Our Signature Menu
        </h1>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          A refined selection of seasonal dishes crafted for intimate private dining and memorable celebrations.
        </p>
      </section>

      {/* ── Category tabs ── */}
      <div className="flex justify-center gap-2 flex-wrap px-4 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              activeCategory === cat
                ? "bg-white text-black font-semibold"
                : "border border-white/12 text-white/50 hover:border-white/25 hover:text-white/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Two-column menu list ── */}
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
          <div className="divide-y-0">
            {left.map((item) => <MenuItemRow key={item.id} item={item} />)}
          </div>
          <div className="divide-y-0">
            {right.map((item) => <MenuItemRow key={item.id} item={item} />)}
          </div>
        </div>

        {/* Allergy note */}
        <p className="mt-6 pb-10 text-[11px] text-white/30 leading-relaxed">
          All dishes are prepared with seasonal ingredients. Please inform our team of any allergies or dietary restrictions before ordering.
        </p>
      </div>

      {/* ── Chef Recommends banner — full width ── */}
      <div className="relative overflow-hidden min-h-[380px] mx-4 md:mx-6 rounded-2xl mb-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=700&fit=crop"
          alt="Chef recommends"
          fill
          className="object-cover"
          unoptimized
          priority={false}
        />
        {/* Gradient — heavier at bottom, lighter at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />

        {/* Content pinned to bottom-left */}
        <div className="absolute bottom-0 left-0 p-8 md:p-10">
          {/* "Chef Recommends" pill */}
          <div className="mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-white/55">
            Chef Recommends
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Black Truffle Tagliatelle
          </h2>
          <p className="text-sm text-white/50 mb-6 max-w-sm leading-relaxed">
            Handmade pasta with black truffle cream, parmesan crisp, and a delicate herb finish.
          </p>

          <Link
            href="/restaurants"
            className="inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            Reserve a Table
          </Link>
        </div>
      </div>

    </div>
  );
}
