"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from "@/lib/auth";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        await signUpWithEmail(form.email, form.password, form.name);
      } else {
        await signInWithEmail(form.email, form.password);
      }
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push(redirect);
    } catch {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-24">
      <GlassCard className="w-full max-w-md" glow="cyan">
        <h1 className="text-2xl font-bold mb-1">
          {mode === "login" ? "Welcome back" : "Join Kaizen Tech"}
        </h1>
        <p className="text-text-muted text-sm mb-6">
          {mode === "login"
            ? "Sign in to register for events and join discussions."
            : "Create your account and become part of the community."}
        </p>

        <form onSubmit={handleEmail} className="space-y-4">
          {mode === "signup" && (
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && (
            <p className="text-sm text-accent-highlight">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-bg-secondary text-text-muted">or</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={handleGoogle}
          disabled={loading}
          type="button"
        >
          Continue with Google
        </Button>

        <p className="text-center text-sm text-text-muted mt-6">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-accent-primary hover:underline"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-accent-primary hover:underline"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </GlassCard>
    </div>
  );
}
