import * as React from "react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/types/common";

export type BadgeVariant = "solid" | "soft" | "outline" | "text";

const solid: Record<Tone, string> = {
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  info: "bg-secondary text-white",
  neutral: "bg-neutral text-white",
  primary: "bg-primary text-white",
  accent: "bg-accent text-white",
};

const soft: Record<Tone, string> = {
  success: "bg-success-bg text-green-800",
  warning: "bg-warning-bg text-amber-800",
  danger: "bg-danger-bg text-red-800",
  info: "bg-info-bg text-secondary",
  neutral: "bg-neutral-bg text-neutral",
  primary: "bg-row-alt text-primary",
  accent: "bg-row-highlight text-accent-active",
};

const outline: Record<Tone, string> = {
  success: "border border-success text-success",
  warning: "border border-warning text-warning",
  danger: "border border-danger text-danger",
  info: "border border-secondary text-secondary",
  neutral: "border border-neutral text-neutral",
  primary: "border border-primary text-primary",
  accent: "border border-accent text-accent-active",
};

/** Colored uppercase text only (table status labels in the tenants list). */
const text: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-secondary",
  neutral: "text-neutral",
  primary: "text-primary",
  accent: "text-accent-active",
};

const variantMap = { solid, soft, outline, text };

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  leftIcon?: React.ReactNode;
}

export function Badge({
  tone = "neutral",
  variant = "solid",
  size = "sm",
  dot,
  leftIcon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap",
        variant === "text"
          ? "px-0 py-0 text-[11px] font-semibold uppercase tracking-wider"
          : size === "sm"
            ? "px-2.5 py-1 text-[11px]"
            : "px-3 py-1.5 text-xs",
        variantMap[variant][tone],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {leftIcon}
      {children}
    </span>
  );
}
