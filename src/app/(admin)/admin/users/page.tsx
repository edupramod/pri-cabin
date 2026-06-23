export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { UserAdminActions } from "./UserAdminActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

const ROLE_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default", owner: "secondary", customer: "outline",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") redirect("/login");

  await connectDB();
  const users = await UserModel.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users ({users.length})</h1>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={String(user._id)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-sm">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{user.name}</p>
                      <Badge variant={ROLE_BADGE[user.role] || "outline"} className="text-xs">{user.role}</Badge>
                      {user.suspended && <Badge variant="destructive" className="text-xs">Suspended</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {formatDate(user.createdAt.toString())}</p>
                  </div>
                </div>
                {String(user._id) !== session.user.id && (
                  <UserAdminActions
                    userId={String(user._id)}
                    currentRole={user.role}
                    suspended={user.suspended}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
