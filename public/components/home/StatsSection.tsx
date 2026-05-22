"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import type { SiteStats } from "@/types";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsub;
  }, [display]);

  return <span ref={ref}>0</span>;
}

const labels = [
  { key: "members" as const, label: "Members" },
  { key: "eventsHosted" as const, label: "Events Hosted" },
  { key: "registrations" as const, label: "Registrations" },
  { key: "visitors" as const, label: "Visitors" },
];

export function StatsSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12 tracking-tight"
        >
          By the numbers
        </motion.h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {labels.map(({ key, label }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="text-center py-8">
                <p className="text-4xl font-bold text-accent-primary mb-2">
                  <Counter value={stats[key]} />+
                </p>
                <p className="text-sm text-text-muted">{label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
