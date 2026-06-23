import Link from "next/link";
import { UtensilsCrossed, MapPin, Phone, Mail } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Cabins", href: "/restaurants" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
];

export function LumiereCabinsFooter() {
  return (
    <footer className="bg-[#0d0d0d] border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 text-white mb-4">
              <UtensilsCrossed className="h-5 w-5" strokeWidth={1.5} />
              <span className="font-semibold text-base">LumièreCabins</span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed max-w-[200px]">
              Premium private dining cabins reservable online for an unforgettable experience.
            </p>
            {/* Avatar stack */}
            <div className="flex mt-5 -space-x-2">
              {["#6b7280", "#374151", "#1f2937"].map((bg, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#0d0d0d]"
                  style={{ backgroundColor: bg }}
                />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                Pokhara, Nepal
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                9814170802
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                hello@lumierecabins.com
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Opening Hours</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center justify-between text-sm">
                <span className="text-white/50">Mon - Fri</span>
                <span className="text-white/80">12:00 – 23:00</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="text-white/50">Sat - Sun</span>
                <span className="text-white/80">11:00 – 00:00</span>
              </li>
              <li className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Open 7 Days a Week
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} LumièreCabins. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
