"use client";

import * as React from "react";
import { Bar, BarChart as RBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { theme } from "@/lib/theme";
import type { ChartSeries, SeriesDatum } from "@/types/charts";
import { ChartTooltip } from "./ChartCard";

export interface BarChartProps {
  data: SeriesDatum[];
  series: ChartSeries[];
  xKey: string;
  stacked?: boolean;
  horizontal?: boolean;
  showGrid?: boolean;
  barRadius?: number;
  yFormatter?: (v: number) => string;
  tooltipFormatter?: (value: number | string, name?: string) => React.ReactNode;
}

const axisStyle = { fontSize: 11, fill: theme.colors.muted };

export function BarChart({
  data,
  series,
  xKey,
  stacked,
  horizontal,
  showGrid = true,
  barRadius = 4,
  yFormatter,
  tooltipFormatter,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
        barCategoryGap="25%"
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={horizontal} horizontal={!horizontal} />
        )}
        {horizontal ? (
          <>
            <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={yFormatter} />
            <YAxis type="category" dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} width={90} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={yFormatter} width={48} />
          </>
        )}
        <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} cursor={{ fill: theme.colors.rowAlt }} />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId={stacked ? "stack" : undefined}
            fill={s.color ?? theme.chartPalette[i % theme.chartPalette.length]}
            radius={stacked && i !== series.length - 1 ? 0 : barRadius}
            maxBarSize={40}
          />
        ))}
      </RBarChart>
    </ResponsiveContainer>
  );
}
