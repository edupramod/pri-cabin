import { LockKeyhole, CalendarCheck, Clock, PartyPopper, UtensilsCrossed, Users } from "lucide-react";

const FEATURES = [
  {
    icon: LockKeyhole,
    title: "Fully Private Cabins",
    desc: "Enjoy complete privacy for family gatherings, celebrations, and weddings.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Online Reservation",
    desc: "Book your cabin online from the comfort of your home in seconds.",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    desc: "View available cabins instantly with live availability status.",
  },
  {
    icon: PartyPopper,
    title: "Event & Birthday Arrangements",
    desc: "Perfect for special occasions and celebrations.",
  },
  {
    icon: UtensilsCrossed,
    title: "Premium Food & Service",
    desc: "Handcrafted menus and attentive service prepared by expert chefs.",
  },
  {
    icon: Users,
    title: "Family Friendly Environment",
    desc: "Comfortable cabins designed for every family.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-[#0d0d0d] py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-3">
            Why Choose Us
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl leading-snug">
            Why Choose Our Private Dining<br />Experience?
          </h2>
          <p className="mt-4 text-sm text-white/45 max-w-lg mx-auto leading-relaxed">
            Experience comfort, privacy, and culinary excellence with our dedicated private dining cabins.
            Book your preferred cabin and enjoy the best-in-class service within a sublime setting.
          </p>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-white/8 bg-[#141414] p-5 hover:border-white/15 transition-all"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Icon className="h-4 w-4 text-white/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
