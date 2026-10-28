"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartCard";

const data = [
  { subject: "Face", value: 60 },
  { subject: "RFID", value: 25 },
  { subject: "Fingerprint", value: 15 },
];

/** Small radar chart for biometric method usage distribution. */
export function BiometricRadar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#e3e8ef" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#8a94a6" }} />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
        <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
