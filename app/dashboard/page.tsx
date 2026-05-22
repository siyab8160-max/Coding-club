"use client";

import { useEffect, useState } from "react";
import { Calendar, ClipboardList, Users, Eye } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  getEvents,
  getRecentRegistrations,
  getRegistrationCount,
  getUsersCount,
  getSiteStats,
} from "@/lib/firestore";
import type { Event, Registration } from "@/types";

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState({
    events: 0,
    registrations: 0,
    users: 0,
    visitors: 0,
  });
  const [recent, setRecent] = useState<Registration[]>([]);
  const [chartData, setChartData] = useState<
    { name: string; registrations: number }[]
  >([]);
  const [eventTitles, setEventTitles] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const [events, regCount, users, siteStats, recentRegs] =
        await Promise.all([
          getEvents(),
          getRegistrationCount(),
          getUsersCount(),
          getSiteStats(),
          getRecentRegistrations(10),
        ]);

      const titles: Record<string, string> = {};
      events.forEach((e: Event) => {
        titles[e.id] = e.title;
      });
      setEventTitles(titles);

      setStats({
        events: events.length,
        registrations: regCount,
        users,
        visitors: siteStats.visitors,
      });
      setRecent(recentRegs);

      const { getRegistrations } = await import("@/lib/firestore");
      const allRegs = await getRegistrations();
      const counts: Record<string, number> = {};
      allRegs.forEach((r) => {
        counts[r.eventId] = (counts[r.eventId] || 0) + 1;
      });
      setChartData(
        events.slice(0, 8).map((e: Event) => ({
          name: e.title.length > 12 ? e.title.slice(0, 12) + "…" : e.title,
          registrations: counts[e.id] || 0,
        }))
      );
    }
    load().catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Events"
          value={stats.events}
          icon={Calendar}
          accent="cyan"
        />
        <DashboardCard
          title="Total Registrations"
          value={stats.registrations}
          icon={ClipboardList}
          accent="purple"
        />
        <DashboardCard
          title="Active Users"
          value={stats.users}
          icon={Users}
          accent="pink"
        />
        <DashboardCard
          title="Visitors"
          value={stats.visitors}
          icon={Eye}
          accent="cyan"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="font-semibold mb-4">Registrations per event</h2>
          <StatsChart data={chartData} />
        </GlassCard>
        <GlassCard>
          <h2 className="font-semibold mb-4">Recent registrations</h2>
          <RecentTable
            registrations={recent}
            eventTitles={eventTitles}
          />
        </GlassCard>
      </div>
    </div>
  );
}
