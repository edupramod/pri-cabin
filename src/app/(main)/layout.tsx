import { LumiereCabinsHeader } from "@/components/layout/LumiereCabinsHeader";
import { LumiereCabinsFooter } from "@/components/layout/LumiereCabinsFooter";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <LumiereCabinsHeader />
      <main className="flex-1">{children}</main>
      <LumiereCabinsFooter />
    </div>
  );
}
