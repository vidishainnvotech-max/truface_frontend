"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { theme } from "@/lib/theme";
import { formatNumber } from "@/lib/utils";
import type { ChartDatum } from "@/types/charts";
import { ChartTooltip } from "./ChartCard";

export interface DonutChartProps {
  data: ChartDatum[];
  /** Center label (e.g. "98.2%"). Defaults to total. */
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
  thickness?: number; // px
  /** Show a single-value ring (value vs remainder) instead of segments. */
  gauge?: { value: number; max?: number; color?: string };
  tooltipFormatter?: (value: number | string, name?: string) => React.ReactNode;
}

export function DonutChart({ data, centerValue, centerLabel, thickness = 18, gauge, tooltipFormatter }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const chartData: ChartDatum[] = gauge
    ? [
        { name: "Value", value: gauge.value, color: gauge.color ?? theme.colors.secondary },
        { name: "Remaining", value: Math.max(0, (gauge.max ?? 100) - gauge.value), color: theme.colors.rowAlt },
      ]
    : data;

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={`${100 - thickness * 2.2}%`}
            outerRadius="100%"
            paddingAngle={gauge ? 0 : 2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            cornerRadius={gauge ? thickness : 3}
          >
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.color ?? theme.chartPalette[i % theme.chartPalette.length]} />
            ))}
          </Pie>
          {!gauge && <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} />}
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold leading-none text-primary tabular-nums">
          {centerValue ?? (gauge ? `${gauge.value}%` : formatNumber(total))}
        </span>
        {centerLabel && <span className="mt-1 text-[11px] uppercase tracking-wider text-foreground-muted">{centerLabel}</span>}
      </div>
    </div>
  );
}
