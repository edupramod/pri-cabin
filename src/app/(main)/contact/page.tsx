"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";

const SUBJECTS = [
  "Reservation Inquiry",
  "Private Event",
  "Cabin Inquiry",
  "Menu Information",
  "Corporate Booking",
  "General Question",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [loading, setLoading]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <div className="mx-auto max-w-2xl px-4 md:px-6 pt-8 pb-16">

        {/* ── Outer wrapper card ── */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6 md:p-8">

          {/* ── Page header ── */}
          <div className="mb-7">
            {/* GET IN TOUCH pill */}
            <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] text-white/45 mb-4">
              Get in Touch
            </span>
            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2 leading-tight">
              We&apos;d Love to Hear From You
            </h1>
            <p className="text-[13px] text-white/42 leading-relaxed max-w-md">
              Reach out for reservations, private events, cabin inquiries, or anything else you need. Our team is ready to help.
            </p>
          </div>

          {/* ── Send a Message card ── */}
          <div className="rounded-xl border border-white/[0.07] bg-[#191919] p-5 mb-3">
            <h2 className="text-base font-semibold text-white mb-0.5">Send a Message</h2>
            <p className="text-xs text-white/38 mb-5">
              Tell us about your preferred date, group size, and occasion.
            </p>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-white">Message Sent!</p>
                  <p className="text-sm text-white/42 mt-1">We&apos;ll get back to you within 24 hours.</p>
                </div>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">

                {/* Full Name */}
                <div>
                  <label className="block text-[11px] text-white/45 mb-1.5">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full rounded-lg border border-white/[0.08] bg-[#202020] px-3.5 py-2.5 text-sm text-white placeholder-white/22 outline-none focus:border-white/25 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] text-white/45 mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-lg border border-white/[0.08] bg-[#202020] px-3.5 py-2.5 text-sm text-white placeholder-white/22 outline-none focus:border-white/25 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] text-white/45 mb-1.5">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#202020] px-3.5 py-2.5 text-sm text-white placeholder-white/22 outline-none focus:border-white/25 transition-colors"
                  />
                </div>

                {/* Subject — custom dropdown */}
                <div className="relative">
                  <label className="block text-[11px] text-white/45 mb-1.5">Subject</label>
                  <button
                    type="button"
                    onClick={() => setSubjectOpen((o) => !o)}
                    className="w-full flex items-center justify-between rounded-lg border border-white/[0.08] bg-[#202020] px-3.5 py-2.5 text-sm text-left outline-none focus:border-white/25 transition-colors"
                  >
                    <span className={form.subject ? "text-white" : "text-white/22"}>
                      {form.subject || "Choose a topic"}
                    </span>
                    <svg
                      className={`h-4 w-4 text-white/35 transition-transform shrink-0 ${subjectOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {subjectOpen && (
                    <div className="absolute z-20 mt-1 w-full rounded-lg border border-white/[0.08] bg-[#242424] overflow-hidden shadow-2xl">
                      {SUBJECTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setForm((p) => ({ ...p, subject: s })); setSubjectOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${
                            form.subject === s ? "text-white" : "text-white/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] text-white/45 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    rows={6}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#202020] px-3.5 py-2.5 text-sm text-white placeholder-white/22 outline-none focus:border-white/25 transition-colors resize-none"
                  />
                </div>

                {/* Submit — wide white rounded button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-white/92 transition-colors disabled:opacity-60 mt-1"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* ── Visit Us ── */}
          <div className="rounded-xl border border-white/[0.07] bg-[#191919] p-5 mb-3">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <MapPin className="h-4 w-4 text-white/55" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-white text-sm mb-1">Visit Us</p>
            <p className="text-[13px] text-white/42">Pokhara, Nepal</p>
          </div>

          {/* ── Call or Email ── */}
          <div className="rounded-xl border border-white/[0.07] bg-[#191919] p-5 mb-3">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Phone className="h-4 w-4 text-white/55" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-white text-sm mb-1">Call or Email</p>
            <p className="text-[13px] text-white/42">9814170902</p>
            <p className="text-[13px] text-white/42">hello@lumierecabins.com</p>
          </div>

          {/* ── Opening Hours ── */}
          <div className="rounded-xl border border-white/[0.07] bg-[#191919] p-5">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <Clock className="h-4 w-4 text-white/55" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-white text-sm mb-3">Opening Hours</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/42">Mon - Fri</span>
                <span className="text-[13px] text-white/70">12:00 - 23:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/42">Sat - Sun</span>
                <span className="text-[13px] text-white/70">11:00 - 00:00</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/20 px-3 py-1 text-[11px] text-emerald-400">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              Open 7 Days a Week
            </span>
          </div>

        </div>{/* end outer card */}

      </div>
    </div>
  );
}
