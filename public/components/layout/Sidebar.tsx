"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  MessageSquare,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsSuperAdmin } from "@/hooks/useRole";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  {
    href: "/dashboard/registrations",
    label: "Registrations",
    icon: ClipboardList,
  },
  { href: "/dashboard/comments", label: "Comments", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const isSuperAdmin = useIsSuperAdmin();

  return (
    <aside className="w-64 shrink-0 glass border-r border-white/10 min-h-[calc(100vh-0px)] p-4 flex flex-col">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to site
      </Link>
      <p className="text-xs uppercase tracking-wider text-text-muted mb-4 px-2">
        Admin
      </p>
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              pathname === href
                ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                : "text-text-muted hover:bg-white/5 hover:text-text-primary"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
        {isSuperAdmin && (
          <Link
            href="/dashboard/admins"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mt-2",
              pathname === "/dashboard/admins"
                ? "bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20"
                : "text-text-muted hover:bg-white/5"
            )}
          >
            <Shield className="w-4 h-4" />
            Manage Admins
          </Link>
        )}
      </nav>
    </aside>
  );
}
