"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Flag } from "lucide-react";

interface BookingActionsProps {
  bookingId: string;
  approved?: boolean;
}

export function BookingActions({ bookingId, approved }: BookingActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [ownerNotes, setOwnerNotes] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: string) => {
    setLoading(status);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ownerNotes: ownerNotes.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Booking ${status}` });
        router.refresh();
        router.push("/owner/bookings");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {approved ? "Mark as Complete" : "Respond to Request"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ownerNotes">Note for customer (optional)</Label>
          <Textarea
            id="ownerNotes"
            value={ownerNotes}
            onChange={(e) => setOwnerNotes(e.target.value)}
            placeholder="Any special instructions, confirmation details..."
            rows={3}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {!approved && (
            <>
              <Button
                onClick={() => updateStatus("approved")}
                disabled={!!loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading === "approved" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus("rejected")}
                disabled={!!loading}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                {loading === "rejected" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Decline
              </Button>
            </>
          )}
          {approved && (
            <Button
              onClick={() => updateStatus("completed")}
              disabled={!!loading}
              variant="outline"
            >
              {loading === "completed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
              Mark as Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
