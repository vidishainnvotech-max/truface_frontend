"use client";

import * as React from "react";
import { CalendarDays, Download, TriangleAlert, Timer, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { methodMeta } from "./tab-utils";
import type { EmployeeDetails } from "@/types/employees";

export interface AttendanceLogsTabProps {
  details: EmployeeDetails;
}

const statusOptions = [
  { label: "All Records", value: "all" },
  { label: "On Time", value: "on-time" },
  { label: "Late Arrival", value: "late" },
];

export function AttendanceLogsTab({ details }: AttendanceLogsTabProps) {
  const { monthSummary, monthLogs } = details;
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const pageSize = 7;

  const filtered = status === "all" ? monthLogs : monthLogs.filter((l) => l.status === status);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <StatGrid cols={5}>
        <StatCard
          label="Total Days Scheduled"
          value={`${monthSummary.totalScheduled} Days`}
          tone="info"
          icon={<CalendarDays />}
          footer={<span className="text-foreground-muted">Excludes PTO/Holidays</span>}
        />
        <StatCard
          label="Present Days"
          value={monthSummary.presentRate}
          tone="success"
          icon={<UserCheck />}
          footer={<span className="font-semibold text-success">Rate</span>}
        />
        <StatCard
          label="Absent Days"
          value={monthSummary.absentDays}
          tone="success"
          icon={<CalendarDays />}
          footer={<span className="font-semibold text-success">Perfect Attendance</span>}
        />
        <StatCard
          label="Late Incidents"
          value={`${monthSummary.lateIncidents} Incidents`}
          tone="warning"
          icon={<TriangleAlert />}
          footer={<span className="font-semibold text-warning">0.15 Days</span>}
        />
        <StatCard
          label="Avg Work Hours"
          value={monthSummary.avgWorkHours}
          tone="accent"
          icon={<Timer />}
        />
      </StatGrid>

      <Card padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-foreground-secondary transition-colors hover:bg-surface-muted"
          >
            <CalendarDays className="h-3.5 w-3.5 text-cta" />
            Date Range: Oct 1 - Oct 31, 2024
          </button>
          <div className="w-44">
            <Select
              options={statusOptions}
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Status filter"
            />
          </div>
          <div className="ml-auto">
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Check-In</th>
                <th className="px-5 py-3 font-semibold">Check-Out</th>
                <th className="px-5 py-3 font-semibold">Duration</th>
                <th className="px-5 py-3 font-semibold">Verification Method</th>
                <th className="px-5 py-3 font-semibold">Location Gate</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((log) => (
                <tr key={log.date} className="transition-colors hover:bg-surface-muted">
                  <td className="px-5 py-3 text-[13px] font-medium text-foreground">{log.date}</td>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{log.checkIn}</td>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{log.checkOut}</td>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{log.duration}</td>
                  <td className="px-5 py-3">
                    <Badge tone={methodMeta[log.method].tone} variant="soft" leftIcon={methodMeta[log.method].icon}>
                      {methodMeta[log.method].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-foreground-secondary">{log.gate}</td>
                  <td className="px-5 py-3">
                    <Badge tone={log.status === "on-time" ? "success" : "warning"} variant="soft">
                      {log.status === "on-time" ? "On Time" : "Late Arrival"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-foreground-muted">
                    No records match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-5 py-3">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
            className="text-xs"
          />
        </div>
      </Card>
    </div>
  );
}
