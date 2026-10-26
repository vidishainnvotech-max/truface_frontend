"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { theme } from "@/lib/theme";
import type { ChartSeries, SeriesDatum } from "@/types/charts";
import { ChartTooltip } from "./ChartCard";

export interface LineChartProps {
  data: SeriesDatum[];
  series: ChartSeries[];
  /** Key in `data` used for the X axis. */
  xKey: string;
  /** Fill area under the line (gradient) — matches dashboard hero chart. */
  area?: boolean;
  curved?: boolean;
  showGrid?: boolean;
  showDots?: boolean;
  yFormatter?: (v: number) => string;
  xFormatter?: (v: string | number) => string;
  tooltipFormatter?: (value: number | string, name?: string) => React.ReactNode;
}

const axisStyle = { fontSize: 11, fill: theme.colors.muted };

export function LineChart({
  data,
  series,
  xKey,
  area = false,
  curved = true,
  showGrid = true,
  showDots = false,
  yFormatter,
  xFormatter,
  tooltipFormatter,
}: LineChartProps) {
  const Chart = area ? AreaChart : RLineChart;
  const type = curved ? "monotone" : "linear";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        {area && (
          <defs>
            {series.map((s, i) => {
              const c = s.color ?? theme.chartPalette[i % theme.chartPalette.length];
              return (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
        )}
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />}
        <XAxis dataKey={xKey} tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={xFormatter} />
        <YAxis tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={yFormatter} width={48} />
        <Tooltip content={<ChartTooltip formatter={tooltipFormatter} />} cursor={{ stroke: theme.colors.border }} />
        {series.map((s, i) => {
          const c = s.color ?? theme.chartPalette[i % theme.chartPalette.length];
          return area ? (
            <Area
              key={s.key}
              type={type}
              dataKey={s.key}
              name={s.label}
              stroke={c}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={showDots ? { r: 3, fill: c, strokeWidth: 0 } : false}
              activeDot={{ r: 4, fill: c, stroke: "#fff", strokeWidth: 2 }}
            />
          ) : (
            <Line
              key={s.key}
              type={type}
              dataKey={s.key}
              name={s.label}
              stroke={c}
              strokeWidth={2}
              dot={showDots ? { r: 3, fill: c, strokeWidth: 0 } : false}
              activeDot={{ r: 4, fill: c, stroke: "#fff", strokeWidth: 2 }}
            />
          );
        })}
      </Chart>
    </ResponsiveContainer>
  );
}
