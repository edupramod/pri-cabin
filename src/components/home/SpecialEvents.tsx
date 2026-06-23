import Link from "next/link";
import { Gift, Heart, Briefcase, Users } from "lucide-react";

const EVENTS = [
  {
    icon: Gift,
    title: "Birthday Packages",
    desc: "Memorable celebrations with custom décor and curated menus.",
    href: "/restaurants",
  },
  {
    icon: Heart,
    title: "Anniversary Celebrations",
    desc: "Romantic private dining arrangements tailored exclusively for you.",
    href: "/restaurants",
  },
  {
    icon: Briefcase,
    title: "Corporate Meetings",
    desc: "Professional spaces with privacy, premium service, and seamless hosting.",
    href: "/restaurants",
  },
  {
    icon: Users,
    title: "Family Gatherings",
    desc: "Comfortable cabins designed for every type of family celebration.",
    href: "/restaurants",
  },
];

export function SpecialEvents() {
  return (
    <section className="bg-[#111111] py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
            Special Events
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Celebrate Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map(({ icon: Icon, title, desc, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-white/8 bg-[#141414] p-5 hover:border-white/20 transition-all flex flex-col gap-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Icon className="h-4.5 w-4.5 text-white/60" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
