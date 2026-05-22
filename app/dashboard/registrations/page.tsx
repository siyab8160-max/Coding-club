"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { getEvents, getRegistrations } from "@/lib/firestore";
import { formatDateTime, exportToCSV } from "@/lib/utils";
import type { Event, Registration } from "@/types";

export default function DashboardRegistrationsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filterEventId, setFilterEventId] = useState("");

  useEffect(() => {
    getEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    getRegistrations(filterEventId || undefined)
      .then(setRegistrations)
      .catch(() => setRegistrations([]));
  }, [filterEventId]);

  const eventTitles: Record<string, string> = {};
  events.forEach((e) => {
    eventTitles[e.id] = e.title;
  });

  const handleExport = () => {
    exportToCSV(
      registrations.map((r) => ({
        name: r.participantName,
        email: r.email,
        college: r.college,
        phone: r.phone,
        team: r.teamName || "",
        event: eventTitles[r.eventId] || r.eventId,
        date: r.timestamp ? formatDateTime(r.timestamp) : "",
      })),
      `registrations-${filterEventId || "all"}.csv`
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Registrations</h1>
        <div className="flex gap-3">
          <select
            value={filterEventId}
            onChange={(e) => setFilterEventId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-accent-primary/50"
          >
            <option value="">All events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/10 bg-white/5">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">College</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Team</th>
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4">{r.participantName}</td>
                  <td className="p-4 text-text-muted">{r.email}</td>
                  <td className="p-4 text-text-muted">{r.college}</td>
                  <td className="p-4 text-text-muted">{r.phone}</td>
                  <td className="p-4 text-text-muted">{r.teamName || "—"}</td>
                  <td className="p-4 text-text-muted">
                    {eventTitles[r.eventId] || "—"}
                  </td>
                  <td className="p-4 text-text-muted">
                    {r.timestamp ? formatDateTime(r.timestamp) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrations.length === 0 && (
            <p className="text-text-muted text-center py-12">
              No registrations found.
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
