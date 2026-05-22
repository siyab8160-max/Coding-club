"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { getEventBySlug } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { formatDateTime, isDeadlinePassed } from "@/lib/utils";
import { RegistrationForm } from "@/components/events/RegistrationForm";
import { CommentThread } from "@/components/comments/CommentThread";
import { Badge } from "@/components/ui/Badge";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Event } from "@/types";

type Tab = "description" | "rules" | "schedule" | "prizes";

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("description");
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!slug) return;
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getEventBySlug(slug)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!event?.registrationDeadline) return;
    const update = () => {
      const diff =
        event.registrationDeadline.toDate().getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Closed");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`${d}d ${h}h ${m}m left`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [event]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-24 text-center py-20">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(event.registrationDeadline);
  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "About" },
    { id: "rules", label: "Rules" },
    { id: "schedule", label: "Schedule" },
    { id: "prizes", label: "Prizes" },
  ];

  return (
    <div className="pt-16">
      <div className="relative h-64 sm:h-80 md:h-96 bg-bg-secondary">
        {event.bannerURL && (
          <Image
            src={event.bannerURL}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10 pb-20">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex-1">
            {event.title}
          </h1>
          <Badge variant={deadlinePassed ? "warning" : "success"}>
            <Clock className="w-3 h-3 mr-1 inline" />
            {countdown || "Registration open"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-accent-primary" />
            {formatDateTime(event.date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-accent-primary" />
            {event.venue}
          </span>
          {event.organizers?.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-accent-primary" />
              {event.organizers.join(", ")}
            </span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 flex-wrap border-b border-white/10 pb-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    tab === t.id
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <GlassCard>
              {tab === "description" && (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{event.description}</ReactMarkdown>
                </div>
              )}
              {tab === "rules" && (
                <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>{event.rules || "No rules specified."}</ReactMarkdown>
                </div>
              )}
              {tab === "schedule" && (
                <ul className="space-y-3">
                  {event.schedule?.length ? (
                    event.schedule.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-4 py-2 border-b border-white/5 last:border-0"
                      >
                        <span className="text-accent-primary font-mono text-sm shrink-0 w-24">
                          {item.time}
                        </span>
                        <span className="text-text-muted">{item.activity}</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-text-muted">Schedule TBA</p>
                  )}
                </ul>
              )}
              {tab === "prizes" && (
                <div className="prose prose-invert prose-sm">
                  <ReactMarkdown>{event.prizes || "Prizes TBA"}</ReactMarkdown>
                </div>
              )}
            </GlassCard>

            <CommentThread eventId={event.id} />
          </div>

          <div className="lg:col-span-1">
            {!deadlinePassed ? (
              <RegistrationForm event={event} />
            ) : (
              <GlassCard className="text-center py-8">
                <Badge variant="warning">Registration closed</Badge>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
