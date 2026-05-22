"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatDate, truncate, isPast } from "@/lib/utils";
import type { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const past = isPast(event.date);

  return (
    <GlassCard glow="cyan" className="p-0 overflow-hidden flex flex-col h-full">
      <div className="relative h-44 bg-bg-secondary">
        {event.bannerURL ? (
          <Image
            src={event.bannerURL}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            No banner
          </div>
        )}
        {past && (
          <Badge className="absolute top-3 right-3" variant="default">
            Past
          </Badge>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>
        <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.venue}
          </span>
        </div>
        <p className="text-sm text-text-muted flex-1 mb-4">
          {truncate(event.description.replace(/[#*_`]/g, ""), 100)}
        </p>
        <Link href={`/events/${event.slug}`}>
          <Button variant="ghost" size="sm" className="w-full">
            View Details <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
