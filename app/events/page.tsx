"use client";

import { useState, useEffect } from "react";
import { orderBy } from "firebase/firestore";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { isPast } from "@/lib/utils";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getEvents([orderBy("date", "desc")])
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return !isPast(e.date);
    return isPast(e.date);
  });

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Events</h1>
        <p className="text-text-muted mb-8">
          Hackathons, workshops, and everything we&apos;re building together.
        </p>

        <div className="flex gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                filter === tab.id
                  ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
                  : "text-text-muted hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-text-muted text-center py-20 glass rounded-2xl">
            No events found.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
