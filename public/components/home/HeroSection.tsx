"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const stagger = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent-primary/20 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent-secondary/25 blur-[120px]"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-accent-highlight/15 blur-[100px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          custom={0}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mx-auto mb-6 w-24 h-24 sm:w-28 sm:h-28"
        >
          <motion.div
            animate={{ 
              y: [0, -8, 0],
            }}
            whileHover={{ 
              scale: 1.08,
              rotate: [0, -2, 2, 0],
              boxShadow: "0 20px 30px rgba(0, 229, 255, 0.25)",
            }}
            transition={{
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="w-full h-full rounded-3xl overflow-hidden shadow-xl border border-text-primary/10 bg-white flex items-center justify-center p-2 cursor-pointer select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Mirai Tech Club Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
        <motion.p
          custom={1}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-accent-primary text-sm font-medium tracking-widest uppercase mb-4"
        >
          Mirai Tech Club
        </motion.p>
        <motion.h1
          custom={2}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          Build. <span className="gradient-text">Break.</span> Iterate.
        </motion.h1>
        <motion.p
          custom={3}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-lg text-text-muted max-w-2xl mx-auto mb-10"
        >
          Kaizen Tech is where curious minds meet cutting-edge tech. Hackathons,
          workshops, and a community that ships.
        </motion.p>
        <motion.div
          custom={4}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/events">
            <Button size="lg">Explore Events</Button>
          </Link>
          <Link href="/members">
            <Button variant="ghost" size="lg">
              Join Community
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
