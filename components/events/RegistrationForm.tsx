"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import {
  createRegistration,
  getRegistrationByUserAndEvent,
} from "@/lib/firestore";
import type { Event } from "@/types";

interface RegistrationFormProps {
  event: Event;
}

export function RegistrationForm({ event }: RegistrationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    participantName: "",
    email: "",
    college: "",
    phone: "",
    teamName: "",
  });

  useEffect(() => {
    if (!user || checked) return;
    getRegistrationByUserAndEvent(user.uid, event.id).then((existing) => {
      if (existing) setAlreadyRegistered(true);
      setChecked(true);
    });
  }, [user, event.id, checked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const existing = await getRegistrationByUserAndEvent(
        user.uid,
        event.id
      );
      if (existing) {
        setAlreadyRegistered(true);
        return;
      }
      await createRegistration({
        eventId: event.id,
        userId: user.uid,
        participantName: form.participantName,
        email: form.email,
        college: form.college,
        phone: form.phone,
        teamName: form.teamName || undefined,
      });
      setSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <GlassCard>
        <p className="text-text-muted text-sm">
          <a href="/auth/login" className="text-accent-primary hover:underline">
            Sign in
          </a>{" "}
          to register for this event.
        </p>
      </GlassCard>
    );
  }

  if (alreadyRegistered) {
    return (
      <GlassCard className="text-center py-8">
        <Badge variant="success" className="text-base px-4 py-2">
          You&apos;re registered ✓
        </Badge>
      </GlassCard>
    );
  }

  if (success) {
    return (
      <GlassCard className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-primary/20 flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-accent-primary" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">You&apos;re in!</h3>
        <p className="text-text-muted text-sm">
          Registration confirmed. See you at the event.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-4">Register for this event</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          required
          value={form.participantName}
          onChange={(e) =>
            setForm({ ...form, participantName: e.target.value })
          }
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="College"
          required
          value={form.college}
          onChange={(e) => setForm({ ...form, college: e.target.value })}
        />
        <Input
          label="Phone"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Team Name (optional)"
          value={form.teamName}
          onChange={(e) => setForm({ ...form, teamName: e.target.value })}
        />
        {error && <p className="text-sm text-accent-highlight">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting…" : "Register Now"}
        </Button>
      </form>
    </GlassCard>
  );
}
