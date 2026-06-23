"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface VerifyRestaurantButtonsProps {
  restaurantId: string;
  currentStatus: string;
}

export function VerifyRestaurantButtons({ restaurantId, currentStatus }: VerifyRestaurantButtonsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(status);
    try {
      const res = await fetch(`/api/admin/restaurants/${restaurantId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Restaurant ${status}` });
        router.refresh();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-1.5 flex-wrap">
      {currentStatus !== "verified" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus("verified")}
          disabled={!!loading}
          className="text-green-700 border-green-300 hover:bg-green-50 h-7 text-xs"
        >
          {loading === "verified" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
          Verify
        </Button>
      )}
      {currentStatus !== "rejected" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus("rejected")}
          disabled={!!loading}
          className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 text-xs"
        >
          {loading === "rejected" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
          Reject
        </Button>
      )}
      {currentStatus !== "suspended" && currentStatus === "verified" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus("suspended")}
          disabled={!!loading}
          className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 h-7 text-xs"
        >
          {loading === "suspended" ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
          Suspend
        </Button>
      )}
    </div>
  );
}
