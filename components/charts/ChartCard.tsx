import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";
import { EmptyState } from "@/components/common/EmptyState";

export interface ChartCardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  height?: number;
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  /** Optional legend / summary below the header. */
  legend?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/** Card shell shared by all charts: header, loading skeleton, empty state, fixed height body. */
export function ChartCard({
  title,
  subtitle,
  action,
  height = 280,
  loading,
  empty,
  emptyText = "No data for the selected range.",
  legend,
  footer,
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      {legend}
      <div style={{ height }} className="relative w-full">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : empty ? (
          <EmptyState title="No data" description={emptyText} compact className="h-full py-0" />
        ) : (
          children
        )}
      </div>
      {footer && <div className="mt-4 border-t border-border pt-4">{footer}</div>}
    </Card>
  );
}

/* ---------------- Legend ---------------- */
export interface LegendItem {
  label: React.ReactNode;
  color: string;
  value?: React.ReactNode;
}

export function ChartLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={cn("mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-2 text-foreground-secondary">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} aria-hidden />
          <span>{it.label}</span>
          {it.value !== undefined && <span className="font-semibold text-foreground tabular-nums">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Tooltip (shared style) ---------------- */
export interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | string; color?: string; dataKey?: string | number }[];
  formatter?: (value: number | string, name?: string) => React.ReactNode;
}

export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-elevated">
      {label !== undefined && <p className="mb-1.5 font-semibold text-primary">{label}</p>}
      <ul className="space-y-1">
        {payload.map((p, i) => (
          <li key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-foreground-secondary">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name}
            </span>
            <span className="font-semibold text-foreground tabular-nums">
              {formatter ? formatter(p.value ?? "", p.name) : p.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
