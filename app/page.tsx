"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { TeamPreview } from "@/components/home/TeamPreview";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Event, Member, SiteStats } from "@/types";

const emptyStats: SiteStats = {
  members: 0,
  eventsHosted: 0,
  registrations: 0,
  visitors: 0,
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<SiteStats>(emptyStats);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    import("@/lib/firestore").then(
      ({ getFeaturedEvents, getSiteStats, getTeamPreview }) => {
        Promise.all([
          getFeaturedEvents(3),
          getSiteStats(),
          getTeamPreview(6),
        ])
          .then(([e, s, m]) => {
            setEvents(e);
            setStats(s);
            setMembers(m);
          })
          .catch(() => {});
      }
    );
  }, []);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatsSection stats={stats} />
      <FeaturedEvents events={events} />
      <TeamPreview members={members} />
    </>
  );
}
