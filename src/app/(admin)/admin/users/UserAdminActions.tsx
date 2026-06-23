"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserAdminActionsProps {
  userId: string;
  currentRole: string;
  suspended: boolean;
}

export function UserAdminActions({ userId, currentRole, suspended }: UserAdminActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const updateUser = async (update: Record<string, unknown>) => {
    const key = Object.keys(update)[0];
    setLoading(key);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "User updated" });
        router.refresh();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  };

  const deleteUser = async () => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast({ title: "User deleted" });
        router.refresh();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select
        value={currentRole}
        onValueChange={(role) => updateUser({ role })}
        disabled={!!loading}
      >
        <SelectTrigger className="h-8 w-28 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="owner">Owner</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant="outline"
        className={`h-8 text-xs ${suspended ? "text-green-700 border-green-300 hover:bg-green-50" : "text-yellow-700 border-yellow-300 hover:bg-yellow-50"}`}
        onClick={() => updateUser({ suspended: !suspended })}
        disabled={!!loading}
      >
        {loading === "suspended" && <Loader2 className="h-3 w-3 animate-spin" />}
        {suspended ? "Unsuspend" : "Suspend"}
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
        onClick={deleteUser}
        disabled={!!loading}
      >
        {loading === "delete" && <Loader2 className="h-3 w-3 animate-spin" />}
        Delete
      </Button>
    </div>
  );
}
