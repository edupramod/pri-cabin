import type { UserRole } from "@/types";

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    customer: 1,
    owner: 2,
    admin: 3,
  };
  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

export function isOwner(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

export function isCustomer(role: UserRole): boolean {
  return role === "customer" || role === "owner" || role === "admin";
}
