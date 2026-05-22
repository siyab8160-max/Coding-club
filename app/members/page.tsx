"use client";

import { useEffect, useState } from "react";
import { MemberCard } from "@/components/members/MemberCard";
import { getMembers } from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import type { Member } from "@/types";

const sections: {
  key: Member["category"];
  title: string;
}[] = [
  { key: "core", title: "Core Team" },
  { key: "developers", title: "Developers" },
  { key: "designers", title: "Designers" },
  { key: "coordinators", title: "Event Coordinators" },
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    getMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Our Team</h1>
        <p className="text-text-muted mb-12">
          The people building Kaizen Tech on campus.
        </p>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-text-muted text-center py-20 glass rounded-2xl">
            Team profiles coming soon. Add members in Firestore{" "}
            <code className="text-accent-primary">members</code> collection.
          </p>
        ) : (
          sections.map(({ key, title }) => {
            const group = members.filter((m) => m.category === key);
            if (group.length === 0) return null;
            return (
              <section key={key} className="mb-16">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">
                  {title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
