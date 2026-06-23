"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSchema, type RestaurantInput } from "@/validators/restaurant.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/common/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const AMENITIES = [
  { key: "parking", label: "Parking" },
  { key: "wifi", label: "WiFi" },
  { key: "ac", label: "Air Conditioning" },
  { key: "familyRooms", label: "Family Rooms" },
  { key: "coupleSeating", label: "Couple Seating" },
];

interface RestaurantFormProps {
  defaultValues?: Partial<RestaurantInput> & { _id?: string };
  restaurantId?: string;
}

export function RestaurantForm({ defaultValues, restaurantId }: RestaurantFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!restaurantId;

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<RestaurantInput>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      city: "Pokhara",
      priceRange: 2,
      amenities: { parking: false, wifi: false, ac: false, familyRooms: false, coupleSeating: false },
      openingHours: DAYS.map((day) => ({ day, open: "09:00", close: "21:00", closed: false })),
      photos: [],
      ...defaultValues,
    },
  });

  const photos = watch("photos");

  const onSubmit = async (data: RestaurantInput) => {
    try {
      const url = isEdit ? `/api/restaurants/${restaurantId}` : "/api/restaurants";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: isEdit ? "Restaurant updated!" : "Restaurant created! Pending verification." });
        router.push("/owner/restaurants");
        router.refresh();
      } else {
        toast({ title: "Error", description: JSON.stringify(result.error), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Restaurant Name *</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" rows={4} {...register("description")} className={errors.description ? "border-destructive" : ""} placeholder="Describe your restaurant, ambience, specialties..." />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" {...register("address")} className={errors.address ? "border-destructive" : ""} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pokhara","Kathmandu","Chitwan","Butwal","Dharan"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Price Range</Label>
              <Controller
                name="priceRange"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">₨ Budget</SelectItem>
                      <SelectItem value="2">₨₨ Moderate</SelectItem>
                      <SelectItem value="3">₨₨₨ Upscale</SelectItem>
                      <SelectItem value="4">₨₨₨₨ Fine Dining</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Amenities</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMENITIES.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Controller
                  name={`amenities.${key as keyof RestaurantInput["amenities"]}`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={key}
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor={key} className="font-normal cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Opening Hours</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {DAYS.map((day, i) => (
            <div key={day} className="flex items-center gap-3">
              <Controller
                name={`openingHours.${i}.closed`}
                control={control}
                render={({ field }) => (
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} id={`closed-${i}`} />
                )}
              />
              <Label htmlFor={`closed-${i}`} className="w-24 font-normal cursor-pointer shrink-0">{day}</Label>
              <Input type="time" {...register(`openingHours.${i}.open`)} className="w-32" />
              <span className="text-muted-foreground text-sm">–</span>
              <Input type="time" {...register(`openingHours.${i}.close`)} className="w-32" />
              <input type="hidden" {...register(`openingHours.${i}.day`)} value={day} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Photos</CardTitle></CardHeader>
        <CardContent>
          <Controller
            name="photos"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                maxImages={8}
                folder="restaurants"
              />
            )}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Submit for Verification"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
