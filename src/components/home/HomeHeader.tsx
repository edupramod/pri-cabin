"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, UtensilsCrossed, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/restaurants", label: "Cabins" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function HomeHeader() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardLink = () => {
    if (!session?.user) return "/login";
    if (session.user.role === "admin") return "/admin";
    if (session.user.role === "owner") return "/owner";
    return "/dashboard";
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white">
          <UtensilsCrossed className="h-5 w-5" strokeWidth={1.5} />
          <span className="font-bold text-base tracking-tight">LumièreCabins</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-white/80 hover:text-white transition-colors outline-none">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={session.user.image ?? ""} />
                  <AvatarFallback className="text-xs bg-white/10 text-white">
                    {getInitials(session.user.name ?? "U")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{session.user.name?.split(" ")[0]}</span>
                <ChevronDown className="h-3 w-3 text-white/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1a1a1a] border-white/10 text-white">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium text-white">{session.user.name}</div>
                  <div className="text-xs text-white/40">{session.user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white text-white/70">
                  <Link href={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white text-white/70">
                  <Link href="/dashboard/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-400 focus:bg-white/10 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1.5"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-white/30 bg-transparent px-4 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-white/10 mt-2">
              {session?.user ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="w-full rounded-md px-3 py-2 text-sm text-red-400 text-left hover:bg-white/5"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-md px-3 py-2 text-sm text-center text-white/80 border border-white/20">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-md px-3 py-2 text-sm text-center text-white border border-white/30 bg-white/10">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
