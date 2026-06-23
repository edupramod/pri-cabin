import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <UtensilsCrossed className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Private Dining Pokhara</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover and book private dining experiences across Pokhara — from intimate couple cabins to private family rooms.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/restaurants" className="hover:text-foreground transition-colors">All Restaurants</Link></li>
              <li><Link href="/restaurants?amenities=coupleSeating" className="hover:text-foreground transition-colors">Couple Dining</Link></li>
              <li><Link href="/restaurants?amenities=familyRooms" className="hover:text-foreground transition-colors">Family Rooms</Link></li>
              <li><Link href="/restaurants?sort=rating" className="hover:text-foreground transition-colors">Top Rated</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link href="/register?role=owner" className="hover:text-foreground transition-colors">List Your Restaurant</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Private Dining Pokhara. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Pokhara, Gandaki Province, Nepal</p>
        </div>
      </div>
    </footer>
  );
}
