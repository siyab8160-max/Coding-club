import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "cyan" | "purple" | "pink";
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  accent = "cyan",
}: DashboardCardProps) {
  const colors = {
    cyan: "text-accent-primary",
    purple: "text-accent-secondary",
    pink: "text-accent-highlight",
  };

  return (
    <GlassCard glow={accent === "cyan" ? "cyan" : accent === "purple" ? "purple" : "pink"}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colors[accent]} opacity-80`} />
      </div>
    </GlassCard>
  );
}
