"use client";

import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { slugify } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/firestore";
import { uploadEventBanner } from "@/lib/storage";
import type { Event } from "@/types";

interface EventFormProps {
  event?: Event;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ event, userId, onSuccess, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: event?.title || "",
    description: event?.description || "",
    venue: event?.venue || "",
    date: event?.date
      ? event.date.toDate().toISOString().slice(0, 16)
      : "",
    registrationDeadline: event?.registrationDeadline
      ? event.registrationDeadline.toDate().toISOString().slice(0, 16)
      : "",
    organizers: event?.organizers?.join(", ") || "",
    prizes: event?.prizes || "",
    rules: event?.rules || "",
    schedule: event?.schedule?.length
      ? JSON.stringify(event.schedule, null, 2)
      : '[{"time":"10:00 AM","activity":"Registration"}]',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let schedule = [];
      try {
        schedule = JSON.parse(form.schedule);
      } catch {
        schedule = [];
      }

      if (!form.title.trim()) {
        throw new Error("Title is required.");
      }
      if (!form.date || !form.registrationDeadline) {
        throw new Error("Event date and registration deadline are required.");
      }

      const eventDate = new Date(form.date);
      const deadlineDate = new Date(form.registrationDeadline);
      if (Number.isNaN(eventDate.getTime()) || Number.isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date. Use the date picker for Event Date and Registration Deadline.");
      }

      const slug = event?.slug || slugify(form.title);
      const data = {
        slug,
        title: form.title,
        description: form.description,
        bannerURL: event?.bannerURL || "",
        venue: form.venue,
        date: Timestamp.fromDate(eventDate),
        registrationDeadline: Timestamp.fromDate(deadlineDate),
        organizers: form.organizers.split(",").map((s) => s.trim()),
        prizes: form.prizes,
        rules: form.rules,
        schedule,
        createdBy: event?.createdBy || userId,
      };

      if (event) {
        let bannerURL = event.bannerURL;
        if (bannerFile) {
          bannerURL = await uploadEventBanner(bannerFile, event.id);
        }
        await updateEvent(event.id, { ...data, bannerURL });
      } else {
        const id = await createEvent({ ...data, bannerURL: "" });
        if (bannerFile) {
          const bannerURL = await uploadEventBanner(bannerFile, id);
          await updateEvent(id, { bannerURL });
        }
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save event";
      const hint =
        message.includes("permission") || message.includes("PERMISSION")
          ? "\n\nTip: In Firestore, your users/{uid} document ID must match your Auth UID, and role must be admin or superadmin."
          : "";
      alert(`${message}${hint}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <Input
        label="Title"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <div>
        <label className="block text-sm text-text-muted mb-1.5">
          Description (Markdown)
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
        />
      </div>
      <Input
        label="Venue"
        required
        value={form.venue}
        onChange={(e) => setForm({ ...form, venue: e.target.value })}
      />
      <Input
        label="Event Date"
        type="datetime-local"
        required
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <Input
        label="Registration Deadline"
        type="datetime-local"
        required
        value={form.registrationDeadline}
        onChange={(e) =>
          setForm({ ...form, registrationDeadline: e.target.value })
        }
      />
      <Input
        label="Organizers (comma-separated)"
        value={form.organizers}
        onChange={(e) => setForm({ ...form, organizers: e.target.value })}
      />
      <div>
        <label className="block text-sm text-text-muted mb-1.5">Prizes</label>
        <textarea
          rows={2}
          value={form.prizes}
          onChange={(e) => setForm({ ...form, prizes: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
        />
      </div>
      <div>
        <label className="block text-sm text-text-muted mb-1.5">Rules</label>
        <textarea
          rows={2}
          value={form.rules}
          onChange={(e) => setForm({ ...form, rules: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-primary focus:outline-none focus:border-accent-primary/50"
        />
      </div>
      <div>
        <label className="block text-sm text-text-muted mb-1.5">
          Schedule (JSON array)
        </label>
        <textarea
          rows={3}
          value={form.schedule}
          onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-primary font-mono text-xs focus:outline-none focus:border-accent-primary/50"
        />
      </div>
      <div>
        <label className="block text-sm text-text-muted mb-1.5">
          Banner Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
          className="text-sm text-text-muted"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : event ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
