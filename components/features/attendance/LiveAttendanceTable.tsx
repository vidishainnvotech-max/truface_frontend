"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Cloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/common/EmptyState";
import { methodMeta, syncMeta, verificationMeta } from "./attendance-meta";
import { hubOptions, verificationOptions } from "@/config/attendance-options";
import type { LiveAttendanceEntry } from "@/types/attendance";

export interface LiveAttendanceTableProps {
  entries: LiveAttendanceEntry[];
}

export function LiveAttendanceTable({ entries }: LiveAttendanceTableProps) {
  const [query, setQuery] = React.useState("");
  const [hub, setHub] = React.useState("all-nodes");
  const [status, setStatus] = React.useState("all");
  const [syncing, setSyncing] = React.useState(false);

  const filtered = entries.filter((e) => {
    const matchesQuery =
      !query ||
      e.employeeName.toLowerCase().includes(query.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      e.location.toLowerCase().includes(query.toLowerCase());
    const matchesHub =
      hub === "all-nodes" ||
      hub === "all" ||
      e.location.toLowerCase().includes(hub.replace("pune-assembly", "pune").replace("mumbai-hq", "mumbai").replace("chennai-warehouse", "chennai"));
    const matchesStatus = status === "all" || e.verification === status;
    return matchesQuery && matchesHub && matchesStatus;
  });

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
  };

  return (
    <Card padding="none">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
        <div className="relative w-full sm:w-72">
          <Input
            leftIcon={<Search />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employee name, ID..."
            className="h-9 pl-9 text-sm"
            aria-label="Search employees"
          />
        </div>
        <div className="w-48">
          <Select
            options={hubOptions}
            value={hub}
            onChange={setHub}
            selectSize="sm"
            aria-label="Filter hub"
          />
        </div>
        <div className="w-44">
          <Select
            options={verificationOptions}
            value={status}
            onChange={setStatus}
            selectSize="sm"
            aria-label="Status filter"
          />
        </div>
        <div className="ml-auto">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Cloud className="h-4 w-4" />}
            onClick={handleForceSync}
            loading={syncing}
          >
            Force Cloud Sync
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No live events"
          description="No verification activity matches the current filters."
          compact
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Verified Location</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Timestamp</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Cloud Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row) => {
                const method = methodMeta[row.method];
                const verification = verificationMeta[row.verification];
                const sync = syncMeta[row.sync];
                return (
                  <tr key={row.id} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.employeeName} size="xs" />
                        <div className="min-w-0 leading-tight">
                          <p className="truncate text-[13px] font-semibold text-foreground">{row.employeeName}</p>
                          <p className="truncate text-[11px] text-foreground-muted">
                            ID: {row.employeeId} • {row.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-foreground-secondary">{row.location}</td>
                    <td className="px-5 py-3">
                      <Badge tone={method.tone} variant="soft" leftIcon={method.icon}>
                        {method.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-medium tabular-nums text-foreground">
                      {row.timestamp}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={verification.tone} variant="soft">
                        {verification.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={sync.tone} variant="soft">
                        {sync.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-foreground-muted">
        <span>
          Showing {filtered.length} of {entries.length} verification events
        </span>
        <Link href="/attendance/records" className="inline-flex items-center gap-1 font-semibold text-cta hover:underline">
          Open Attendance Records
        </Link>
      </div>
    </Card>
  );
}
