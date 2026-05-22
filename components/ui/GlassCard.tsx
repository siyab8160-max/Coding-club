"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "cyan" | "purple" | "pink" | false;
  children: React.ReactNode;
}

const glowClasses = {
  cyan: "hover:border-accent-primary/50 hover:shadow-neon",
  purple: "hover:border-accent-secondary/50 hover:shadow-neon-purple",
  pink: "hover:border-accent-highlight/50 hover:shadow-neon-pink",
};

export function GlassCard({
  glow = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300",
        glow && glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
