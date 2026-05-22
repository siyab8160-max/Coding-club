"use client";

import { useAuth } from "./useAuth";
import type { UserRole } from "@/types";
import { isAdminRole } from "@/lib/auth";

export function useRole(): UserRole | null {
  const { profile, loading } = useAuth();
  if (loading) return null;
  return profile?.role ?? null;
}

export function useIsAdmin(): boolean {
  const role = useRole();
  return isAdminRole(role);
}

export function useIsSuperAdmin(): boolean {
  const role = useRole();
  return role === "superadmin";
}
