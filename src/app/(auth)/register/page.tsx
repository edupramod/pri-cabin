"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/validators/auth.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [role, setRole] = useState<"customer" | "owner">(
    searchParams.get("role") === "owner" ? "owner" : "customer"
  );
  const [googleLoadingRole, setGoogleLoadingRole] = useState<"customer" | "owner" | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role }),
      });
      const result = await res.json();

      if (!result.success) {
        toast({ title: "Registration failed", description: result.error, variant: "destructive" });
        return;
      }

      await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      toast({ title: "Account created!", description: "Welcome to Private Cabin Pokhara." });
      router.push(role === "owner" ? "/owner" : "/");
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  const handleGoogle = async (selectedRole: "customer" | "owner") => {
    setGoogleLoadingRole(selectedRole);
    await signIn("google", {
      callbackUrl: `/api/auth/post-signup?role=${selectedRole}`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Join Private Cabin Pokhara</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Two separate Google buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11"
            onClick={() => handleGoogle("customer")}
            disabled={!!googleLoadingRole}
          >
            {googleLoadingRole === "customer"
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <GoogleIcon />
            }
            Continue with Google as Diner
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-11"
            onClick={() => handleGoogle("owner")}
            disabled={!!googleLoadingRole}
          >
            {googleLoadingRole === "owner"
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <GoogleIcon />
            }
            Continue with Google as Restaurant Owner
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or register with email</span>
          <Separator className="flex-1" />
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* I am a — role selector */}
          <div className="space-y-1.5">
            <Label>I am a *</Label>
            <Select
              value={role}
              onValueChange={(v: "customer" | "owner") => setRole(v)}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Diner</SelectItem>
                <SelectItem value="owner">Restaurant Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Your full name"
              autoComplete="name"
              className={`h-11 ${errors.name ? "border-destructive" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`h-11 ${errors.email ? "border-destructive" : ""}`}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="98XXXXXXXX"
              className="h-11"
              {...register("phone")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 characters"
              autoComplete="new-password"
              className={`h-11 ${errors.password ? "border-destructive" : ""}`}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center pt-0">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}