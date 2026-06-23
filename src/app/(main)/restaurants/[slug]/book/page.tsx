"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingInput } from "@/validators/booking.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronLeft, Calendar, Clock, Users } from "lucide-react";

const TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"];

export default function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [restaurant, setRestaurant] = useState<{ _id: string; name: string; cabins: { _id: string; name: string; capacity: number }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { peopleCount: 2 },
  });

  useEffect(() => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/restaurants/${slug}/book`);
      return;
    }
    fetch(`/api/restaurants?search=${slug}`)
      .then(() => {})
      .catch(() => {});

    // Fetch restaurant by slug
    fetch(`/api/restaurants`)
      .then(() => {})
      .catch(() => {});

    // Use a direct fetch for restaurant by slug
    fetch(`/api/restaurants/slug/${slug}`)
      .then(async (r) => {
        if (!r.ok) {
          // fallback: search
          const res = await fetch(`/api/restaurants?search=${slug}&limit=1`);
          const d = await res.json();
          if (d.data?.[0]) setRestaurant(d.data[0]);
        } else {
          const d = await r.json();
          if (d.success) setRestaurant(d.data);
        }
      })
      .catch(console.error);
  }, [session, slug, router]);

  // Better: fetch restaurant detail by slug via a dedicated endpoint pattern
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        // We'll fetch via search page that supports slug lookup
        const res = await fetch(`/api/restaurants?slug=${slug}`);
        const data = await res.json();
        if (data.success && data.data?.length) {
          const r = data.data[0];
          // get cabins from full detail endpoint
          const detRes = await fetch(`/api/restaurants/${r._id}`);
          const det = await detRes.json();
          if (det.success) {
            setRestaurant(det.data);
            setValue("restaurantId", det.data._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (session?.user) fetchRestaurant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, slug]);

  const onSubmit = async (data: BookingInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: "Booking submitted!", description: "The restaurant will confirm within 24 hours." });
        router.push("/dashboard/bookings");
      } else {
        toast({ title: "Error", description: result.error || "Failed to submit booking", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/restaurants/${slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to restaurant
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Reserve a Table</CardTitle>
          {restaurant && (
            <p className="text-sm text-muted-foreground">at {restaurant?.name}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("restaurantId")} />

            {/* Cabin selection */}
            {((restaurant?.cabins?.length) ?? 0) > 0 && (
              <div className="space-y-1.5">
                <Label>Private Space (optional)</Label>
                <Select onValueChange={(v) => setValue("cabinId", v === "none" ? undefined : v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="No preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No preference</SelectItem>
                    {(restaurant?.cabins ?? []).map((cabin) => (
                      <SelectItem key={cabin._id} value={cabin._id}>
                        {cabin.name} (up to {cabin.capacity} guests)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="bookingDate" className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Date
              </Label>
              <Input
                id="bookingDate"
                type="date"
                min={today}
                {...register("bookingDate")}
                className={errors.bookingDate ? "border-destructive" : ""}
              />
              {errors.bookingDate && <p className="text-xs text-destructive">{errors.bookingDate.message}</p>}
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Time
              </Label>
              <Select onValueChange={(v) => setValue("bookingTime", v)}>
                <SelectTrigger className={errors.bookingTime ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.split(":").map((p, i) => {
                        if (i === 0) {
                          const h = parseInt(p);
                          return h > 12 ? h - 12 : h === 0 ? 12 : h;
                        }
                        return `:${p} ${parseInt(t.split(":")[0]) >= 12 ? "PM" : "AM"}`;
                      }).join("")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bookingTime && <p className="text-xs text-destructive">{errors.bookingTime.message}</p>}
            </div>

            {/* People count */}
            <div className="space-y-1.5">
              <Label htmlFor="peopleCount" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Number of Guests
              </Label>
              <Input
                id="peopleCount"
                type="number"
                min={1}
                max={50}
                {...register("peopleCount")}
                className={errors.peopleCount ? "border-destructive" : ""}
              />
              {errors.peopleCount && <p className="text-xs text-destructive">{errors.peopleCount.message}</p>}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Special Requests (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Dietary requirements, occasion, seating preferences..."
                {...register("notes")}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !restaurant}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit Booking Request"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Your request will be sent to the restaurant. You&apos;ll be notified once confirmed.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
