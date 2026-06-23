import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
          <UtensilsCrossed className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-lg">Private Dining Pokhara</span>
      </Link>
      {children}
    </div>
  );
}
