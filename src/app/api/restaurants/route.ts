import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import { restaurantSchema } from "@/validators/restaurant.validator";
import { uniqueSlug } from "@/lib/slugify";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "12"));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { verified: "verified" };

    if (search) {
      query.$text = { $search: search };
    }
    if (city) query.city = city;
    if (featured) query.featured = true;

    const amenityFilters = ["parking", "wifi", "ac", "familyRooms", "coupleSeating"];
    amenityFilters.forEach((a) => {
      if (searchParams.get(a) === "true") {
        query[`amenities.${a}`] = true;
      }
    });

    const priceRange = searchParams.get("priceRange");
    if (priceRange) query.priceRange = parseInt(priceRange);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortMap: Record<string, any> = {
      rating: { averageRating: -1 },
      popular: { viewCount: -1 },
      newest: { createdAt: -1 },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortQuery: any = sortMap[sort] || sortMap.newest;

    const [restaurants, total] = await Promise.all([
      RestaurantModel.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      RestaurantModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: restaurants,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/restaurants error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch restaurants" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "owner" && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`restaurant-create:${ip}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const slug = uniqueSlug(parsed.data.name);
    const restaurant = await RestaurantModel.create({
      ...parsed.data,
      ownerId: session.user.id,
      slug,
    });

    return NextResponse.json({ success: true, data: restaurant }, { status: 201 });
  } catch (error) {
    console.error("POST /api/restaurants error:", error);
    return NextResponse.json({ success: false, error: "Failed to create restaurant" }, { status: 500 });
  }
}
