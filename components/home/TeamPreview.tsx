"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MemberCard } from "@/components/members/MemberCard";
import type { Member } from "@/types";

export function TeamPreview({ members }: { members: Member[] }) {
  return (
    <section className="py-24 px-4 bg-bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-center mb-12"
        >
          Meet the team
        </motion.h2>

        {members.length === 0 ? (
          <p className="text-text-muted text-center">Team profiles coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <MemberCard member={member} compact />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-accent-primary hover:underline"
          >
            Meet the full team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
