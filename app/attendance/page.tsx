"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Clock, LogOut, UserCheck, UserX, ChevronDown } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { ChartCard, LineChart, DonutChart } from "@/components/charts";
import {
  AttendancePageTitle,
  AttendanceHeaderActions,
  AttendanceGlobalSearch,
  methodMeta,
} from "@/components/features/attendance";
import {
  departmentFilterOptions,
  dateRangeOptions,
  hubOptions,
} from "@/config/attendance-options";
import {
  mockAuthMethodShare,
  mockTodayAttendanceLog,
  mockWeeklyAttendanceRate,
} from "@/lib/mock-attendance";
import { cn } from "@/lib/utils";

function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative inline-flex h-8 items-center gap-1 rounded-md border border-border bg-surface pl-3 pr-8 text-xs text-foreground-secondary transition-colors hover:border-border-strong">
      <span className="pointer-events-none whitespace-nowrap">
        {label}: <span className="font-semibold text-foreground">{options.find((o) => o.value === value)?.label}</span>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5" />
    </label>
  );
}

export default function AttendanceDashboardPage() {
  const [dateRange, setDateRange] = React.useState("7d");
  const [hub, setHub] = React.useState("all");
  const [department, setDepartment] = React.useState("all");
  const [segment, setSegment] = React.useState("factory");

  return (
    <DashboardLayout
      guarded={false}
      header={
        <AttendancePageTitle
          title="Attendance Overview"
          subtitle="Smart analysis across factory floor environments and field operatives"
        />
      }
      headerActions={<AttendanceHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <AttendanceGlobalSearch />

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <FilterPill label="Date Range" value={dateRange} options={dateRangeOptions} onChange={setDateRange} />
        <FilterPill label="Location" value={hub} options={hubOptions} onChange={setHub} />
        <FilterPill label="Department" value={department} options={departmentFilterOptions} onChange={setDepartment} />
        <div className="inline-flex overflow-hidden rounded-md border border-border">
          <button
            type="button"
            onClick={() => setSegment("factory")}
            className={cn(
              "h-8 px-3.5 text-xs font-semibold transition-colors",
              segment === "factory" ? "bg-primary text-white" : "bg-surface text-foreground-secondary hover:bg-surface-muted"
            )}
          >
            Factory floor
          </button>
          <button
            type="button"
            onClick={() => setSegment("field")}
            className={cn(
              "h-8 px-3.5 text-xs font-semibold transition-colors",
              segment === "field" ? "bg-primary text-white" : "bg-surface text-foreground-secondary hover:bg-surface-muted"
            )}
          >
            Field Staff
          </button>
        </div>
      </div>

      {/* Primary stats */}
      <StatGrid cols={4}>
        <StatCard
          label="Total Present"
          value={2412}
          tone="success"
          icon={<UserCheck />}
          footer={<span className="font-semibold text-success">84.7% Active</span>}
        />
        <StatCard
          label="Total Absent"
          value={298}
          tone="danger"
          icon={<UserX />}
          footer={<span className="font-semibold text-danger">10.4% Off</span>}
        />
        <StatCard
          label="Late Arrivals"
          value={137}
          tone="warning"
          icon={<Clock />}
          footer={<span className="font-semibold text-warning">4.8% Delay</span>}
        />
        <StatCard
          label="Early Departures"
          value={45}
          tone="info"
          icon={<LogOut />}
          footer={<span className="font-semibold text-secondary">1.5% Early</span>}
        />
      </StatGrid>

      {/* Chart + auth share + verification */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Weekly Attendance Rate (%)"
          action={<span className="text-xs font-semibold text-success">Avg: 83.4%</span>}
          height={280}
        >
          <LineChart
            data={mockWeeklyAttendanceRate}
            series={[{ key: "rate", label: "Attendance Rate", color: "#2563eb" }]}
            xKey="day"
            area
            curved
            showDots
            yFormatter={(v) => `${v}%`}
            tooltipFormatter={(v) => `${v}%`}
          />
        </ChartCard>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Auth Method Share" />
            <ul className="space-y-4">
              {mockAuthMethodShare.map((m) => (
                <li key={m.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground-secondary">{m.label}</span>
                    <span className="font-bold text-foreground tabular-nums">{m.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-bg">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${m.value}%`, backgroundColor: m.color }}
                      role="progressbar"
                      aria-valuenow={m.value}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={m.label}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Verification Success Rate" />
            <div className="flex items-center gap-6">
              <div className="h-32 w-32 shrink-0">
                <DonutChart
                  data={[]}
                  gauge={{ value: 96, max: 100, color: "#16a34a" }}
                  centerValue="96%"
                  centerLabel="Success"
                  thickness={14}
                />
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-2.5 text-foreground-secondary">
                  <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden />
                  Success <span className="font-bold text-foreground tabular-nums">(2,315)</span>
                </li>
                <li className="flex items-center gap-2.5 text-foreground-secondary">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger" aria-hidden />
                  Failed attempts <span className="font-bold text-foreground tabular-nums">(97)</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Today's log */}
      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold leading-tight text-primary">Today&apos;s Attendance Log</h3>
            <p className="mt-0.5 text-sm text-foreground-muted">Chronological verification events from all gates</p>
          </div>
          <Badge tone="success" variant="soft" dot>
            Live
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Employee Name</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Auth Method</th>
                <th className="px-5 py-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockTodayAttendanceLog.map((row) => {
                const method = methodMeta[row.method];
                return (
                  <tr key={row.time} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3 text-[13px] font-medium tabular-nums text-foreground">{row.time}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.employeeName} size="xs" />
                        <span className="text-[13px] font-semibold text-foreground">{row.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-foreground-secondary">{row.department}</td>
                    <td className="px-5 py-3">
                      <Badge
                        tone={row.method === "face" ? "info" : row.method === "rfid" ? "primary" : "warning"}
                        variant="soft"
                      >
                        {method.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={row.status === "success" ? "success" : "danger"} variant="soft">
                        {row.status === "success" ? "Success" : "Failed"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-foreground-muted">
          <span>Showing {mockTodayAttendanceLog.length} of 2,412 check-ins today</span>
          <div className="flex items-center gap-4">
            <Link href="/attendance/live" className="inline-flex items-center gap-1 font-semibold text-cta hover:underline">
              Live Terminal
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/attendance/records" className="inline-flex items-center gap-1 font-semibold text-cta hover:underline">
              View All Records
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
