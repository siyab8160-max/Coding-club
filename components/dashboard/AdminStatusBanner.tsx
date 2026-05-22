"use client";

import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useRole";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";

export function AdminStatusBanner() {
  const { user, profile, loading } = useAuth();
  const isAdmin = useIsAdmin();

  if (loading) return null;

  return (
    <GlassCard className="mb-6 p-4 text-sm">
      <p className="text-text-muted mb-2">Account status (verify admin setup)</p>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant={isAdmin ? "success" : "warning"}>
          {isAdmin ? "Admin access OK" : "Not admin"}
        </Badge>
        {profile?.role && (
          <Badge variant="accent">role: {profile.role}</Badge>
        )}
      </div>
      {user && (
        <p className="mt-3 text-xs text-text-muted font-mono break-all">
          Auth UID: {user.uid}
          <br />
          <span className="text-text-primary/80">
            Firestore doc ID must match this exactly → users/{user.uid}
          </span>
        </p>
      )}
      {!profile && user && (
        <p className="mt-2 text-xs text-accent-highlight">
          No Firestore profile found. Create users/{user.uid} with role
          superadmin.
        </p>
      )}
    </GlassCard>
  );
}
