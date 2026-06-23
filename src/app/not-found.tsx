import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-[#0a0a0a]">
      <p className="text-8xl font-bold text-white/10 leading-none select-none">404</p>
      <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
      <p className="mt-2 text-sm text-white/40 max-w-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-7 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/restaurants"
          className="rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-white/8 transition-colors"
        >
          Browse Cabins
        </Link>
      </div>
    </div>
  );
}
