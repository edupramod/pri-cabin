import Image from "next/image";
import { Star } from "lucide-react";
import type { IReview } from "@/types";
import type { IUser } from "@/types";

interface TestimonialsProps {
  reviews: IReview[];
}

const STATIC = [
  {
    name: "Prashant Thakur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment:
      "The private dining cabin made our anniversary truly memorable. Impeccable service and the most romantic setting I have ever experienced!",
  },
  {
    name: "Saurab Thakur",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment:
      "Perfect for a corporate dinner. Real-time availability was such a much-needed convenience!",
  },
  {
    name: "Brenda",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment:
      "I booked for my daughter's birthday. The cabin and food were absolutely excellent!",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-white text-white" : "fill-white/15 text-white/15"}`}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const items =
    reviews.length > 0
      ? reviews.slice(0, 3).map((r) => {
          const user = r.userId as IUser;
          return {
            name: typeof user === "object" ? user.name : "Guest",
            avatar: typeof user === "object" ? (user.avatar ?? null) : null,
            rating: r.rating,
            comment: r.comment,
          };
        })
      : STATIC;

  return (
    <section className="bg-[#0d0d0d] py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
            Testimonials
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            What Our Guests Say
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 bg-[#141414] p-5 flex flex-col gap-3"
            >
              {/* Avatar + name row */}
              <div className="flex items-center gap-3">
                {item.avatar ? (
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border border-white/10">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" sizes="40px" unoptimized />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-white/60">{initials(item.name)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{item.name}</p>
                  <Stars rating={item.rating} />
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs text-white/50 leading-relaxed flex-1">
                &ldquo;{item.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
