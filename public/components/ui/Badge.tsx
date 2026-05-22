import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

const variants = {
  default: "bg-white/10 text-text-muted",
  success: "bg-accent-primary/20 text-accent-primary",
  warning: "bg-accent-highlight/20 text-accent-highlight",
  accent: "bg-accent-secondary/20 text-accent-secondary",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
