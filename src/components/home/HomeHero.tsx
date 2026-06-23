"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, Users, ChevronDown, Clock, Sparkles } from "lucide-react";

const TIME_SLOTS = [
  "12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM",
];
const CABIN_TYPES = ["Any Type","Fully Private","Semi-Private","Open"];

const STATS = [
  { value: "5000+", label: "Happy Guests" },
  { value: "50+",   label: "Private Cabins" },
  { icon: "clock",  label: "Quick Reservations" },
  { icon: "star",   label: "5-Star Reviews" },
];

export function HomeHero() {
  const [guests, setGuests]       = useState(2);
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState(TIME_SLOTS[6]);
  const [cabinType, setCabinType] = useState(CABIN_TYPES[0]);
  const [special, setSpecial]     = useState("");

  const buildUrl = () => {
    const p = new URLSearchParams();
    if (guests)                     p.set("guests", guests.toString());
    if (date)                       p.set("date", date);
    if (time)                       p.set("time", time);
    if (cabinType !== "Any Type")   p.set("type", cabinType.toLowerCase().replace(" ", "-"));
    return `/restaurants?${p}`;
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Copy ── */}
          <div>
            {/* Pill */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Premium Private Dining
            </div>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Your Private Dining<br />Cabin Awaits
            </h1>

            <p className="mt-5 text-sm text-white/60 max-w-md leading-relaxed">
              Reserve exclusive dining cabins before you arrive and enjoy a seamless,
              comfortable, and memorable restaurant experience.
            </p>
            <p className="mt-3 text-sm text-white/40 max-w-md leading-relaxed">
              Whether you&apos;re planning a family gathering, a romantic dinner, birthday
              celebration, or business meeting, our private cabins provide the perfect
              atmosphere with exceptional food and service.
            </p>

            <Link
              href="/restaurants"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/8 px-5 py-2.5 text-sm text-white hover:bg-white/15 transition-colors"
            >
              Explore Cabins
            </Link>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={i} className="flex flex-col items-start">
                  {s.icon === "clock" ? (
                    <Clock className="h-5 w-5 text-white/50 mb-1" strokeWidth={1.5} />
                  ) : s.icon === "star" ? (
                    <svg className="h-5 w-5 text-white/50 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ) : (
                    <p className="text-xl font-bold text-white">{s.value}</p>
                  )}
                  {s.value && !s.icon && null}
                  <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Booking widget ── */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f0f]/90 backdrop-blur-md p-6 shadow-2xl">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-white">Reserve Your Cabin</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available Today
                </span>
              </div>

              <div className="space-y-3">
                {/* Batch Date */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">
                    Batch Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/25 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Batch Time */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">
                    Batch Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-white/25 [color-scheme:dark]"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                  </div>
                </div>

                {/* Guests + Cabin Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">
                      Guests
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                      <input
                        type="number"
                        min={1} max={30}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/25 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">
                      Cabin Type
                    </label>
                    <div className="relative">
                      <select
                        value={cabinType}
                        onChange={(e) => setCabinType(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-3 pr-7 py-2.5 text-sm text-white focus:outline-none focus:border-white/25 [color-scheme:dark]"
                      >
                        {CABIN_TYPES.map((t) => (
                          <option key={t} value={t} className="bg-[#1a1a1a]">{t}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5 font-medium">
                    Special Requests
                  </label>
                  <textarea
                    rows={2}
                    value={special}
                    onChange={(e) => setSpecial(e.target.value)}
                    placeholder="Any special requests or notes…"
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25"
                  />
                </div>

                {/* CTA */}
                <Link
                  href={buildUrl()}
                  className="block w-full rounded-lg bg-white py-3 text-center text-sm font-semibold text-black hover:bg-white/90 transition-colors mt-1"
                >
                  Reserve for Dining — Live Cabin Status
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
