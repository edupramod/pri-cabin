import Image from "next/image";
import { Lock, Sparkles, Heart } from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */
const VALUES = [
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Every cabin is designed to create a secluded, comfortable dining environment.",
  },
  {
    icon: Sparkles,
    title: "Elevated Service",
    desc: "Warm, attentive hospitality that feels polished without ever feeling distant.",
  },
  {
    icon: Heart,
    title: "Meaningful Moments",
    desc: "Spaces and experiences tailored for celebrations, connection, and comfort.",
  },
];

const TEAM = [
  {
    name: "Ava Bennett",
    role: "Founder & Creative Director",
    bio: "Shapes the brand vision and guest experience with a focus on elegance and consistency.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Noah Carter",
    role: "Head of Hospitality",
    bio: "Ensures every reservation, greeting, and table touchpoint feels seamless and personal.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Mila Stone",
    role: "Executive Chef",
    bio: "Creates refined dishes that complement the intimate cabin dining atmosphere.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

const STATS = [
  { value: "5000+", label: "Guests" },
  { value: "50+",   label: "Cabins" },
  { value: "8+",    label: "Years" },
  { value: "4.9★",  label: "Rating" },
];

/* ─── Page ─────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      {/* ══ Hero ════════════════════════════════════════════ */}
      <section className="relative h-[300px] md:h-[340px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=700&fit=crop"
          alt="LumièreCabins dining"
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        {/* Dual gradient — dark left + dark bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content — bottom-left */}
        <div className="absolute inset-0 flex flex-col justify-end pb-10 px-6 md:px-10 max-w-5xl">
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/45 mb-2">
            Our Story
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2 leading-tight">
            About LumièreCabins
          </h1>
          <p className="text-sm text-white/50 max-w-sm leading-relaxed">
            A refined dining destination where privacy, atmosphere, and exceptional service come
            together in every cabin.
          </p>
        </div>
      </section>

      {/* ══ Our Story ════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left image */}
          <div className="relative h-[320px] md:h-[380px] overflow-hidden rounded-xl">
            <Image
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=700&fit=crop"
              alt="Chef plating"
              fill
              className="object-cover"
              unoptimized
            />
            {/* "10+ Years of Excellence" badge */}
            <div className="absolute top-4 left-4 inline-flex items-center rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] text-white/75 backdrop-blur-sm">
              10+ Years of Excellence
            </div>
          </div>

          {/* Right copy */}
          <div className="pt-2">
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/35 mb-3">
              Our Story
            </p>
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-white leading-snug mb-5">
              Crafting private dining moments<br />
              with warmth and precision
            </h2>
            <div className="space-y-3.5 text-[13px] text-white/50 leading-relaxed">
              <p>
                LumièreCabins was created to redefine the way guests experience dining. We blend
                intimate cabin settings with elevated cuisine, thoughtful hospitality, and a calm,
                luxurious atmosphere.
              </p>
              <p>
                From romantic dinners to family celebrations and business gatherings, every detail
                is designed to feel effortless. Our reservation-first approach ensures guests can
                secure the perfect space before they arrive.
              </p>
              <p>
                We believe memorable dining begins with privacy, comfort, and a sense of occasion.
                That philosophy shapes everything from our interiors to our service standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Values ══════════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] py-14 px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/35 mb-3">
              Our Values
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug">
              What defines the LumièreCabins<br />experience
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/[0.07] bg-[#141414] p-6"
              >
                {/* Bare icon — no bg box */}
                <div className="mb-4">
                  <Icon className="h-5 w-5 text-white/50" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-white/42 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Team ════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Meet the Team
          </h2>
          <p className="text-sm text-white/40">
            The people behind the atmosphere, service, and culinary detail.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-white/[0.07] bg-[#141414] px-5 py-6 text-center"
            >
              {/* Avatar */}
              <div className="mx-auto mb-3.5 h-[72px] w-[72px] overflow-hidden rounded-full border border-white/15">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={72}
                  height={72}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              {/* Name */}
              <p className="font-semibold text-white text-sm mb-0.5">{member.name}</p>
              {/* Role */}
              <p className="text-[11px] text-white/38 mb-3">{member.role}</p>
              {/* Bio */}
              <p className="text-xs text-white/42 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ Stats bar ═══════════════════════════════════════ */}
      <section className="bg-[#0d0d0d] border-t border-white/[0.07]">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-white leading-none">{value}</p>
                <p className="text-sm text-white/38 mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
