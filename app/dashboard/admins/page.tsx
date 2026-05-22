"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { searchUserByEmail, updateUserRoleByUid } from "@/lib/firestore";
import { useIsSuperAdmin } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types";

export default function ManageAdminsPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) router.replace("/dashboard");
  }, [isSuperAdmin, router]);

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const user = await searchUserByEmail(email.trim());
      if (!user) {
        setError("No user found with that email.");
        return;
      }
      await updateUserRoleByUid(user.uid, role);
      setMessage(`Updated ${email} to role: ${role}`);
      setEmail("");
    } catch {
      setError("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Shield className="w-7 h-7 text-accent-secondary" />
        Manage Admins
      </h1>
      <p className="text-text-muted text-sm mb-6">
        Super admin only — promote or demote users by email.
      </p>

      <GlassCard className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="User email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="block text-sm text-text-muted mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent-primary/50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          {message && (
            <p className="text-sm text-accent-primary">{message}</p>
          )}
          {error && <p className="text-sm text-accent-highlight">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update Role"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
