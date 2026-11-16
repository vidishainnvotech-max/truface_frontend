"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DevicesPageTitle, DevicesHeaderActions, DevicesGlobalSearch } from "./devices-page-chrome";
import { mockSyncNodes, mockSyncStats } from "@/lib/mock-devices";
import { cn, formatNumber } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import type { SyncNodeRow } from "@/types/devices";

const statusBadge: Record<SyncNodeRow["status"], { label: string; tone: "success" | "info" | "danger" }> = {
  synced: { label: "Synced", tone: "success" },
  syncing: { label: "Syncing", tone: "info" },
  failed: { label: "Failed", tone: "danger" },
};

function progressColor(row: SyncNodeRow) {
  if (row.status === "failed") return "bg-danger";
  if (row.status === "syncing") return "bg-warning";
  return "bg-cta";
}

export function SyncStatusPanel() {
  const toast = useToast();
  const [retrying, setRetrying] = React.useState(false);
  const [nodes, setNodes] = React.useState(mockSyncNodes);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setNodes((prev) =>
        prev.map((n) =>
          n.status === "failed"
            ? { ...n, status: "syncing", progress: Math.max(n.progress, 55), pending: Math.max(0, n.pending - 10) }
            : n
        )
      );
      toast.success("Retry queued for failed transmissions");
    } finally {
      setRetrying(false);
    }
  };

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[{ label: "Sync Status" }]}
      header={
        <DevicesPageTitle
          title="Biometric Sync Center"
          subtitle="Track live local hardware buffer synchronization status against cloud database"
        />
      }
      headerActions={<DevicesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <DevicesGlobalSearch />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-subheading">
            Pending Synchronization Queue
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-bold tabular-nums text-warning">{mockSyncStats.pendingDevices} Devices</span>
            <Badge tone="warning" variant="soft">
              Waiting
            </Badge>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-subheading">
            Total Records Transmitted (24h)
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-bold tabular-nums text-success">
              {formatNumber(mockSyncStats.totalTransmitted24h)}
            </span>
            <Badge tone="success" variant="soft">
              Healthy
            </Badge>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Failed Transmissions</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-3xl font-bold tabular-nums text-danger">{mockSyncStats.failedLogs} Logs</span>
            <Badge tone="danger" variant="soft">
              Action Required
            </Badge>
          </div>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Last Full Synchronization</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{mockSyncStats.lastFullSync}</p>
        </Card>
      </div>

      {/* Pipeline */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">Mass Synchronization Pipeline</h3>
            <p className="mt-0.5 text-xs text-foreground-muted">
              Initiate force retry to pull any stuck logs from regional factory biometric buffer storages
            </p>
          </div>
          <Button
            size="sm"
            loading={retrying}
            onClick={handleRetry}
            className="bg-cta text-white hover:bg-cta-hover"
          >
            Retry Failed Transmissions
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60">
                {["Hardware Node", "Plant Location", "Pending", "Synced", "Last Heartbeat", "Sync Progress", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-foreground-muted"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {nodes.map((row, i) => (
                <tr key={row.id} className={i % 2 === 1 ? "bg-surface-muted/40" : ""}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded bg-info-bg text-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                          <rect x="3" y="4" width="18" height="14" rx="2" />
                          <path d="M8 21h8" />
                        </svg>
                      </span>
                      <div className="leading-tight">
                        <span className="block text-[13px] font-semibold text-foreground">{row.name}</span>
                        <span className="block text-[11px] text-foreground-muted">MAC: {row.serial}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-foreground-secondary">{row.plant}</td>
                  <td
                    className={`px-5 py-3.5 text-[13px] font-semibold tabular-nums ${
                      row.pending > 0 ? "text-warning" : "text-foreground-secondary"
                    }`}
                  >
                    {row.pending}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] tabular-nums text-foreground-secondary">
                    {formatNumber(row.synced)}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-foreground-secondary">{row.lastHeartbeat}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-border">
                        <div
                          className={cn("h-full rounded-full", progressColor(row))}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold tabular-nums text-foreground-secondary">
                        {row.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusBadge[row.status].tone} variant="soft">
                      {statusBadge[row.status].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}
