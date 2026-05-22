"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Target, Rocket } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            About <span className="text-accent-primary">Kaizen</span>
          </h2>
          <p className="text-text-muted leading-relaxed mb-4">
            Kaizen (改善) means continuous improvement — the philosophy behind
            everything we do. We run hackathons, tech talks, and hands-on
            workshops that push students beyond the classroom.
          </p>
          <p className="text-text-muted leading-relaxed">
            Whether you&apos;re writing your first line of code or shipping
            production apps, there&apos;s a place for you here.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          <GlassCard glow="cyan" className="border-l-2 border-l-accent-primary">
            <Target className="w-8 h-8 text-accent-primary mb-3" />
            <h3 className="font-bold mb-2">Mission</h3>
            <p className="text-sm text-text-muted">
              Foster a builder culture on campus through events, mentorship, and
              open collaboration.
            </p>
          </GlassCard>
          <GlassCard glow="purple" className="border-l-2 border-l-accent-secondary">
            <Rocket className="w-8 h-8 text-accent-secondary mb-3" />
            <h3 className="font-bold mb-2">Vision</h3>
            <p className="text-sm text-text-muted">
              Become the premier student tech community — where ideas become
              products and members become leaders.
            </p>
          </GlassCard>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="hidden lg:block absolute right-0 w-1/3 h-64 bg-gradient-to-l from-accent-primary/10 to-transparent rounded-full blur-3xl pointer-events-none"
        />
      </div>
    </section>
  );
}
