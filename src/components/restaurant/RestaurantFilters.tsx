"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const AMENITY_FILTERS = [
  { key: "coupleSeating", label: "Couple Friendly" },
  { key: "familyRooms", label: "Family Rooms" },
  { key: "parking", label: "Parking" },
  { key: "wifi", label: "WiFi" },
  { key: "ac", label: "Air Conditioning" },
];

export function RestaurantFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.push(`/restaurants?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleAmenity = (key: string, checked: boolean) => {
    updateParam(key, checked ? "true" : null);
  };

  const clearAll = () => {
    router.push("/restaurants");
  };

  const hasFilters = AMENITY_FILTERS.some((f) => searchParams.get(f.key) === "true") ||
    searchParams.get("priceRange");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Sort by</h4>
        <Select
          value={searchParams.get("sort") || "newest"}
          onValueChange={(v) => updateParam("sort", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Price range</h4>
        <Select
          value={searchParams.get("priceRange") || ""}
          onValueChange={(v) => updateParam("priceRange", v || null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any price</SelectItem>
            <SelectItem value="1">₨ Budget</SelectItem>
            <SelectItem value="2">₨₨ Moderate</SelectItem>
            <SelectItem value="3">₨₨₨ Upscale</SelectItem>
            <SelectItem value="4">₨₨₨₨ Fine Dining</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Amenities</h4>
        <div className="space-y-3">
          {AMENITY_FILTERS.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <Checkbox
                id={filter.key}
                checked={searchParams.get(filter.key) === "true"}
                onCheckedChange={(checked) => toggleAmenity(filter.key, !!checked)}
              />
              <Label htmlFor={filter.key} className="text-sm font-normal cursor-pointer">
                {filter.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
