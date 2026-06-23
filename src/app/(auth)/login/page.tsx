"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { User, Store, LogIn, Loader2 } from "lucide-react";

type Role = "user" | "owner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || "/";
  const [selectedRole, setSelectedRole] = useState<Role>("user");
  const [loading, setLoading]           = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    document.cookie = `pending_signup_role=${selectedRole === "owner" ? "owner" : "customer"}; path=/; max-age=300`;
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-[500px]">

      {/* ── Top pill badge ── */}
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-2 rounded-full border border-white/12 bg-[#1e1e1e] px-4 py-1.5 text-[13px] text-white/55">
          <LogIn className="h-3.5 w-3.5" strokeWidth={1.5} />
          Continue with Google
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="rounded-2xl border border-white/[0.09] bg-[#1e1e1e] p-7">

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-[1.75rem] font-semibold text-white mb-1.5 leading-tight">
            Choose your role
          </h1>
          <p className="text-[13px] text-white/45 leading-relaxed">
            Select how you want to continue before signing in with Google.
          </p>
        </div>

        {/* ── Role cards ── */}
        <div className="grid grid-cols-2 gap-3 mb-4">

          {/* User card */}
          <button
            onClick={() => setSelectedRole("user")}
            className={`rounded-xl border p-4 text-left transition-all duration-150 ${
              selectedRole === "user"
                ? "border-white/35 bg-white/[0.05]"
                : "border-white/[0.09] bg-[#272727] hover:border-white/20"
            }`}
          >
            {/* Icon circle */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 border border-white/10">
              <User className="h-5 w-5 text-white/80" strokeWidth={1.5} />
            </div>

            <p className="font-semibold text-white text-[15px] mb-1">User</p>
            <p className="text-[12px] text-white/45 leading-relaxed mb-4">
              Book cabins, browse menu, and manage reservations.
            </p>

            {/* Radio indicator */}
            <div className="flex items-center gap-1.5">
              {selectedRole === "user" ? (
                <>
                  <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full border border-white/60 bg-white/10">
                    <div className="h-[7px] w-[7px] rounded-full bg-white" />
                  </div>
                  <span className="text-[11px] text-white/60">Selected</span>
                </>
              ) : (
                <>
                  <div className="h-[15px] w-[15px] rounded-full border border-white/25" />
                  <span className="text-[11px] text-white/35">Choose this role</span>
                </>
              )}
            </div>
          </button>

          {/* Restaurant Owner card */}
          <button
            onClick={() => setSelectedRole("owner")}
            className={`rounded-xl border p-4 text-left transition-all duration-150 ${
              selectedRole === "owner"
                ? "border-white/35 bg-white/[0.05]"
                : "border-white/[0.09] bg-[#272727] hover:border-white/20"
            }`}
          >
            {/* Icon circle */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 border border-white/10">
              <Store className="h-5 w-5 text-white/80" strokeWidth={1.5} />
            </div>

            <p className="font-semibold text-white text-[15px] mb-1">Restaurant Owner</p>
            <p className="text-[12px] text-white/45 leading-relaxed mb-4">
              Manage cabins, availability, and guest requests.
            </p>

            {/* Radio indicator */}
            <div className="flex items-center gap-1.5">
              {selectedRole === "owner" ? (
                <>
                  <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full border border-white/60 bg-white/10">
                    <div className="h-[7px] w-[7px] rounded-full bg-white" />
                  </div>
                  <span className="text-[11px] text-white/60">Selected</span>
                </>
              ) : (
                <>
                  <div className="h-[15px] w-[15px] rounded-full border border-white/25" />
                  <span className="text-[11px] text-white/35">Choose this role</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* ── Google sign-in bar ── */}
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#272727] px-4 py-3.5">
          {/* Left: Google circle + text */}
          <div className="flex items-center gap-3">
            {/* Dark circle with Google G */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] border border-white/[0.07]">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-white leading-tight">Sign in with Google</p>
              <p className="text-[11px] text-white/38 leading-tight mt-0.5">
                Google is the only authentication method.
              </p>
            </div>
          </div>

          {/* Right: Continue button — pill shaped */}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black hover:bg-white/92 transition-colors disabled:opacity-60 shrink-0 ml-3"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}
