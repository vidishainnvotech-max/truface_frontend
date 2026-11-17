"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, RotateCcw, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { methodMeta, syncMeta, verificationMeta } from "./attendance-meta";
import {
  dateRangeOptions,
  hubOptions,
  methodOptions,
  syncOptions,
  verificationOptions,
} from "@/config/attendance-options";
import type { AttendanceAuthMethod, AttendanceRecord, AttendanceVerification, CloudSyncState } from "@/types/attendance";

export interface AttendanceRecordsTableProps {
  rows: AttendanceRecord[];
  total?: number;
}

const PAGE_SIZE = 10;

export function AttendanceRecordsTable({ rows, total }: AttendanceRecordsTableProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState("today");
  const [location, setLocation] = React.useState("all");
  const [method, setMethod] = React.useState<AttendanceAuthMethod | "all">("all");
  const [verification, setVerification] = React.useState<AttendanceVerification | "all">("all");
  const [sync, setSync] = React.useState<CloudSyncState | "all">("all");
  const [page, setPage] = React.useState(1);

  const filtered = rows.filter((r) => {
    const matchesQuery =
      !query ||
      r.employeeName.toLowerCase().includes(query.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      r.department.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = location === "all" || r.location.toLowerCase().includes(location.split("-")[0]);
    const matchesMethod = method === "all" || r.method === method;
    const matchesVerification = verification === "all" || r.verification === verification;
    const matchesSync = sync === "all" || r.sync === sync;
    return matchesQuery && matchesLocation && matchesMethod && matchesVerification && matchesSync;
  });

  const totalCount = total ?? filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetFilters = () => {
    setQuery("");
    setDateRange("today");
    setLocation("all");
    setMethod("all");
    setVerification("all");
    setSync("all");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-tight text-primary">Search &amp; Filters</h3>
            <p className="mt-0.5 text-sm text-foreground-muted">Refine attendance logs by employee, window and state</p>
          </div>
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Search Employee
            </span>
            <Input
              leftIcon={<Search />}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, ID or dept..."
              className="h-9 pl-9 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Date Range
            </span>
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={(v) => {
                setDateRange(v);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Date range"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Location
            </span>
            <Select
              options={hubOptions}
              value={location}
              onChange={(v) => {
                setLocation(v);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Location"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Method
            </span>
            <Select
              options={methodOptions}
              value={method}
              onChange={(v) => {
                setMethod(v as AttendanceAuthMethod);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Method"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Verification
            </span>
            <Select
              options={verificationOptions}
              value={verification}
              onChange={(v) => {
                setVerification(v as AttendanceVerification);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Verification"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Sync Status
            </span>
            <Select
              options={syncOptions}
              value={sync}
              onChange={(v) => {
                setSync(v as CloudSyncState);
                setPage(1);
              }}
              selectSize="sm"
              aria-label="Sync status"
            />
          </label>
        </div>
      </Card>

      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold leading-tight text-primary">Records List</h3>
            <p className="mt-0.5 text-sm text-foreground-muted">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, totalCount)} of{" "}
              {totalCount.toLocaleString()} entries
            </p>
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        </div>

        {paged.length === 0 ? (
          <EmptyState
            title="No records found"
            description="Try adjusting your filters or search terms."
            compact
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
              <thead>
                <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Check-In</th>
                  <th className="px-5 py-3 font-semibold">Check-Out</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Verification</th>
                  <th className="px-5 py-3 font-semibold">Sync State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((row) => {
                  const methodMetaRow = methodMeta[row.method];
                  const verification = verificationMeta[row.verification];
                  const sync = syncMeta[row.sync];
                  return (
                    <tr
                      key={row.id}
                      className="cursor-pointer transition-colors hover:bg-surface-muted"
                      onClick={() => router.push(`/attendance/records/${row.id}`)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.employeeName} size="xs" />
                          <div className="min-w-0 leading-tight">
                            <p className="truncate text-[13px] font-semibold text-foreground">{row.employeeName}</p>
                            <p className="truncate text-[11px] text-foreground-muted">
                              {row.employeeId} • {row.department}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[13px] text-foreground-secondary">{row.date}</td>
                      <td className="px-5 py-3 text-[13px] font-medium tabular-nums text-foreground">{row.checkIn}</td>
                      <td className="px-5 py-3 text-[13px] font-medium tabular-nums text-foreground">{row.checkOut}</td>
                      <td className="px-5 py-3 text-[13px] text-foreground-secondary">{row.location}</td>
                      <td className="px-5 py-3">
                        <Badge tone={methodMetaRow.tone} variant="soft" leftIcon={methodMetaRow.icon}>
                          {methodMetaRow.label}
                        </Badge>
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

        <div className="border-t border-border px-5 py-4">
          <Pagination page={safePage} pageSize={PAGE_SIZE} total={totalCount} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  );
}
