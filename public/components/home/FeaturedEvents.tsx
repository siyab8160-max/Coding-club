"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/types";

export function FeaturedEvents({ events }: { events: Event[] }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Events
            </h2>
            <p className="text-text-muted mt-2">
              Don&apos;t miss what&apos;s coming up
            </p>
          </motion.div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1 text-sm text-accent-primary hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-text-muted text-center py-12 glass rounded-2xl">
            No events yet. Check back soon!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}

        <Link
          href="/events"
          className="sm:hidden flex items-center justify-center gap-1 mt-8 text-sm text-accent-primary"
        >
          View all events <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
