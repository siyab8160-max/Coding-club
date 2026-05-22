"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm text-text-muted">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10",
          "text-text-primary placeholder:text-text-muted/60",
          "focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30",
          "transition-colors",
          error && "border-accent-highlight/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-accent-highlight">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";
