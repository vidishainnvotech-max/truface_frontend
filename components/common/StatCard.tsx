import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";
import type { Tone } from "@/types/common";

export interface StatCardProps {
  label: React.ReactNode;
  value: number | string;
  /** Percentage change; positive = up, negative = down. */
  delta?: number;
  deltaLabel?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
  /** Extra small text / link under the value. */
  footer?: React.ReactNode;
  loading?: boolean;
  className?: string;
  /** Show colored left accent bar. */
  accent?: boolean;
}

const iconTone: Record<Tone, string> = {
  primary: "bg-row-alt text-primary",
  info: "bg-info-bg text-secondary",
  accent: "bg-row-highlight text-accent-active",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-neutral-bg text-neutral",
};

const accentBar: Record<Tone, string> = {
  primary: "border-l-primary",
  info: "border-l-secondary",
  accent: "border-l-accent",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-danger",
  neutral: "border-l-neutral",
};

export function StatCard({
  label,
  value,
  delta,
  deltaLabel = "vs last period",
  icon,
  tone = "info",
  footer,
  loading,
  className,
  accent,
}: StatCardProps) {
  const dir = delta === undefined ? null : delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  return (
    <Card className={cn("relative", accent && cn("border-l-4", accentBar[tone]), className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-subheading">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-1.5 text-3xl font-bold leading-none text-primary tabular-nums">
              {typeof value === "number" ? formatNumber(value) : value}
            </p>
          )}
        </div>
        {icon && (
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md [&>svg]:h-5 [&>svg]:w-5", iconTone[tone])}>
            {icon}
          </span>
        )}
      </div>

      {(dir || footer) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {dir && !loading && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                dir === "up" && "bg-success-bg text-success",
                dir === "down" && "bg-danger-bg text-danger",
                dir === "flat" && "bg-neutral-bg text-neutral"
              )}
            >
              {dir === "up" && <ArrowUpRight className="h-3 w-3" />}
              {dir === "down" && <ArrowDownRight className="h-3 w-3" />}
              {dir === "flat" && <Minus className="h-3 w-3" />}
              {Math.abs(delta!).toFixed(1)}%
            </span>
          )}
          {dir && <span className="text-foreground-muted">{deltaLabel}</span>}
          {footer && <span className="ml-auto text-foreground-muted">{footer}</span>}
        </div>
      )}
    </Card>
  );
}

/** Responsive grid wrapper for StatCards. */
export function StatGrid({ children, className, cols = 4 }: React.PropsWithChildren<{ className?: string; cols?: 2 | 3 | 4 | 5 }>) {
  const colCls = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 xl:grid-cols-4", 5: "md:grid-cols-3 xl:grid-cols-5" }[cols];
  return <div className={cn("grid grid-cols-1 gap-4", colCls, className)}>{children}</div>;
}
