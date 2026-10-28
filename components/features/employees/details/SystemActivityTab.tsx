"use client";

import * as React from "react";
import { CalendarClock, Download, ShieldCheck, UserCog, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import type { EmployeeDetails } from "@/types/employees";

export interface SystemActivityTabProps {
  details: EmployeeDetails;
}

const eventTypeOptions = [
  { label: "All System Events", value: "all" },
  { label: "Access Grant", value: "Access Grant" },
  { label: "Access Deny", value: "Access Deny" },
  { label: "Profile Update", value: "Profile Update" },
];

export function SystemActivityTab({ details }: SystemActivityTabProps) {
  const { system, events } = details;
  const [eventType, setEventType] = React.useState("all");

  const filtered = eventType === "all" ? events : events.filter((e) => e.type === eventType);

  return (
    <div className="space-y-5">
      <StatGrid cols={4}>
        <StatCard
          label="Last Login Recorded"
          value={system.lastLogin}
          tone="info"
          icon={<CalendarClock />}
          footer={<span className="text-foreground-muted">{system.lastLoginSource}</span>}
        />
        <StatCard
          label="Failed Attempts (30d)"
          value={system.failedAttempts}
          tone="success"
          icon={<ShieldCheck />}
          footer={<span className="font-semibold text-success">Perfect Sync Meta</span>}
        />
        <StatCard
          label="Profile Updates"
          value={system.profileUpdates}
          tone="warning"
          icon={<UserCog />}
          footer={<span className="text-foreground-muted">{system.profileUpdateNote}</span>}
        />
        <StatCard
          label="Access Requests"
          value={system.accessRequests}
          tone="accent"
          icon={<KeyRound />}
          footer={<span className="text-foreground-muted">Automatic priors approvals</span>}
        />
      </StatGrid>

      <Card padding="none">
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
          <div className="w-56">
            <Select
              options={eventTypeOptions}
              value={eventType}
              onChange={setEventType}
              selectSize="sm"
              aria-label="Filter event type"
            />
          </div>
          <div className="ml-auto">
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Download Audit Log
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Event Type</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold">Device Terminal</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((event, i) => (
                <tr key={i} className="transition-colors hover:bg-surface-muted">
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{event.timestamp}</td>
                  <td className="px-5 py-3">
                    <Badge tone="info" variant="soft">
                      {event.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-foreground-secondary">{event.description}</td>
                  <td className="px-5 py-3 font-mono text-[12px] text-foreground-muted">{event.device}</td>
                  <td className="px-5 py-3">
                    <Badge
                      tone={event.status === "success" ? "success" : event.status === "failed" ? "danger" : "warning"}
                      variant="soft"
                    >
                      {event.status === "success" ? "Success" : event.status === "failed" ? "Failed" : "Pending"}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-foreground-muted">
                    No events match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
