"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cabinSchema, type CabinInput } from "@/validators/booking.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/common/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/common/EmptyState";
import { DoorClosed, Plus, Loader2, Pencil, Trash2, Users } from "lucide-react";

interface Cabin {
  _id: string;
  name: string;
  description: string;
  privacyType: string;
  capacity: number;
  photos: string[];
  active: boolean;
  restaurantId: string;
}

interface Restaurant {
  _id: string;
  name: string;
}

const PRIVACY_LABELS: Record<string, string> = {
  "open": "Open Seating",
  "semi-private": "Semi-Private",
  "fully-private": "Fully Private",
};

function CabinForm({ restaurantId, defaultValues, cabinId, onSuccess }: {
  restaurantId: string;
  defaultValues?: Partial<CabinInput>;
  cabinId?: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<CabinInput>({
    resolver: zodResolver(cabinSchema),
    defaultValues: { active: true, photos: [], ...defaultValues },
  });

  const photos = watch("photos");

  const onSubmit = async (data: CabinInput) => {
    const url = cabinId ? `/api/cabins/${cabinId}` : "/api/cabins";
    const method = cabinId ? "PUT" : "POST";
    const body = cabinId ? data : { ...data, restaurantId };
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await res.json();
    if (result.success) {
      toast({ title: cabinId ? "Cabin updated" : "Cabin added" });
      onSuccess();
    } else {
      toast({ title: "Error", description: JSON.stringify(result.error), variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Name *</Label>
        <Input {...register("name")} placeholder="e.g. Garden Cabin 1" className={errors.name ? "border-destructive" : ""} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={2} placeholder="Brief description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Privacy Type *</Label>
          <Controller
            name="privacyType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={errors.privacyType ? "border-destructive" : ""}><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Seating</SelectItem>
                  <SelectItem value="semi-private">Semi-Private</SelectItem>
                  <SelectItem value="fully-private">Fully Private</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.privacyType && <p className="text-xs text-destructive">{errors.privacyType.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Capacity *</Label>
          <Input type="number" min={1} max={50} {...register("capacity")} className={errors.capacity ? "border-destructive" : ""} />
          {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Photos</Label>
        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} maxImages={4} folder="cabins" />
          )}
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {cabinId ? "Save Changes" : "Add Cabin"}
        </Button>
      </div>
    </form>
  );
}

export default function OwnerCabinsPage() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantId || "");
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCabin, setEditCabin] = useState<Cabin | null>(null);

  useEffect(() => {
    fetch("/api/owner/restaurants")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setRestaurants(d.data);
          if (!selectedRestaurant && d.data[0]) setSelectedRestaurant(d.data[0]._id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;
    setLoading(true);
    fetch(`/api/owner/cabins?restaurantId=${selectedRestaurant}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCabins(d.data); })
      .finally(() => setLoading(false));
  }, [selectedRestaurant]);

  const deleteCabin = async (id: string) => {
    if (!confirm("Delete this cabin?")) return;
    const res = await fetch(`/api/cabins/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast({ title: "Cabin deleted" });
      setCabins((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Private Spaces</h1>
        <Dialog open={openDialog} onOpenChange={(o) => { setOpenDialog(o); if (!o) setEditCabin(null); }}>
          <DialogTrigger asChild>
            <Button disabled={!selectedRestaurant}><Plus className="h-4 w-4" /> Add Space</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editCabin ? "Edit Space" : "Add Private Space"}</DialogTitle>
            </DialogHeader>
            <CabinForm
              restaurantId={selectedRestaurant}
              cabinId={editCabin?._id}
              defaultValues={editCabin ? {
                name: editCabin.name, description: editCabin.description,
                privacyType: editCabin.privacyType as "open" | "semi-private" | "fully-private",
                capacity: editCabin.capacity, photos: editCabin.photos,
              } : undefined}
              onSuccess={() => {
                setOpenDialog(false);
                setEditCabin(null);
                // Refresh cabins
                if (selectedRestaurant) {
                  fetch(`/api/owner/cabins?restaurantId=${selectedRestaurant}`)
                    .then((r) => r.json())
                    .then((d) => { if (d.success) setCabins(d.data); });
                }
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {restaurants.length > 0 && (
        <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
          <SelectTrigger className="w-72"><SelectValue placeholder="Select restaurant" /></SelectTrigger>
          <SelectContent>
            {restaurants.map((r) => <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : cabins.length === 0 ? (
        <EmptyState icon={DoorClosed} title="No spaces yet" description="Add private cabins or rooms for your restaurant." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {cabins.map((cabin) => (
            <Card key={cabin._id}>
              <CardContent className="p-4">
                {cabin.photos?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cabin.photos[0]} alt={cabin.name} className="w-full h-32 object-cover rounded-md mb-3" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{cabin.name}</h3>
                  <Badge variant="outline" className="text-xs">{PRIVACY_LABELS[cabin.privacyType]}</Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Users className="h-3.5 w-3.5" /> Up to {cabin.capacity} guests
                </div>
                {cabin.description && <p className="text-sm text-muted-foreground mt-1">{cabin.description}</p>}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => { setEditCabin(cabin); setOpenDialog(true); }}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteCabin(cabin._id)} className="text-destructive border-destructive/30">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
