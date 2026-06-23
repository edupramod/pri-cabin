import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "Private Dining Pokhara — Book Private Cabins & Couple Dining",
    template: "%s | Private Dining Pokhara",
  },
  description:
    "Discover and book restaurants with private cabins, couple-friendly dining spaces, and family rooms in Pokhara, Nepal.",
  keywords: ["private dining", "Pokhara", "restaurant booking", "couple dining", "private cabin", "Nepal"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Private Dining Pokhara",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Private Dining Pokhara" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
