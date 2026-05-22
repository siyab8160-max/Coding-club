"use client";

import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { getInitials, cn } from "@/lib/utils";
import type { Member } from "@/types";

interface MemberCardProps {
  member: Member;
  compact?: boolean;
}

export function MemberCard({ member, compact }: MemberCardProps) {
  const socials = [
    { href: member.github, icon: Github },
    { href: member.linkedin, icon: Linkedin },
    { href: member.twitter, icon: Twitter },
  ].filter((s) => s.href);

  return (
    <GlassCard
      glow="purple"
      className={cn("text-center", compact && "p-4")}
    >
      <div
        className={cn(
          "mx-auto rounded-full bg-accent-secondary/20 border border-white/10 flex items-center justify-center font-bold text-accent-primary mb-3 overflow-hidden",
          compact ? "w-16 h-16 text-lg" : "w-24 h-24 text-2xl"
        )}
      >
        {member.photoURL ? (
          <Image
            src={member.photoURL}
            alt={member.name}
            width={compact ? 64 : 96}
            height={compact ? 64 : 96}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(member.name)
        )}
      </div>
      <h3 className={cn("font-bold", compact ? "text-sm" : "text-lg")}>
        {member.name}
      </h3>
      <p className="text-text-muted text-xs mt-1">{member.role}</p>
      {socials.length > 0 && (
        <div className="flex justify-center gap-2 mt-3">
          {socials.map(({ href, icon: Icon }) => (
            <a
              key={href}
              href={href!}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-accent-primary transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
