"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { GlassCard } from "@/components/ui/GlassCard";
import { EventForm } from "@/components/events/EventForm";
import { getEvents, deleteEvent } from "@/lib/firestore";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { Event } from "@/types";

export default function DashboardEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Event | undefined>();

  const load = () => getEvents().then(setEvents).catch(() => setEvents([]));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(id);
    load();
  };

  const handleSuccess = () => {
    setModalOpen(false);
    setEditing(undefined);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button
          onClick={() => {
            setEditing(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Create Event
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Venue</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="p-4 font-medium">{event.title}</td>
                  <td className="p-4 text-text-muted">
                    {formatDate(event.date)}
                  </td>
                  <td className="p-4 text-text-muted">{event.venue}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(event);
                          setModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-accent-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-accent-highlight"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && (
            <p className="text-text-muted text-center py-12">No events yet.</p>
          )}
        </div>
      </GlassCard>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(undefined);
        }}
        title={editing ? "Edit Event" : "Create Event"}
        size="xl"
      >
        {user && (
          <EventForm
            event={editing}
            userId={user.uid}
            onSuccess={handleSuccess}
            onCancel={() => {
              setModalOpen(false);
              setEditing(undefined);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
