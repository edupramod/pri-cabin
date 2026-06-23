import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LayoutDashboard, UtensilsCrossed, DoorClosed, CalendarDays, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/owner", label: "Overview", icon: LayoutDashboard },
  { href: "/owner/restaurants", label: "Restaurants", icon: UtensilsCrossed },
  { href: "/owner/cabins", label: "Cabins", icon: DoorClosed },
  { href: "/owner/bookings", label: "Bookings", icon: CalendarDays },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "owner" && session.user.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px,1fr]">
          <aside>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Owner Portal</p>
              <p className="text-sm font-medium mt-1">{session.user.name}</p>
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
