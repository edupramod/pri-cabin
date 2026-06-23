import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://privatediningpokhara.com";

  let restaurantUrls: MetadataRoute.Sitemap = [];

  try {
    const { connectDB } = await import("@/lib/db");
    const RestaurantModel = (await import("@/models/Restaurant")).default;
    await connectDB();
    const restaurants = await RestaurantModel.find({ verified: "verified" })
      .select("slug updatedAt")
      .lean();

    restaurantUrls = restaurants.map((r) => ({
      url: `${baseUrl}/restaurants/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB not available at build time
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/restaurants`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...restaurantUrls,
  ];
}
