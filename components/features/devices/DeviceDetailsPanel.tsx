"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DevicesPageTitle, DevicesHeaderActions, DevicesGlobalSearch } from "./devices-page-chrome";
import { getDeviceDiagnostics } from "@/lib/mock-devices";
import { cn } from "@/lib/utils";
import type { DeviceListItem } from "@/types/devices";
import { Cpu, Pencil, RefreshCw, Trash2, Wrench, Zap } from "lucide-react";

const resultTone: Record<string, "success" | "info" | "warning"> = {
  Success: "success",
  Info: "info",
  Warning: "warning",
};

const categoryTone: Record<string, "success" | "info" | "warning"> = {
  Attendance: "success",
  "System Log": "info",
  "Security Alert": "warning",
};

export interface DeviceDetailsPanelProps {
  device: DeviceListItem;
}

export function DeviceDetailsPanel({ device }: DeviceDetailsPanelProps) {
  const diagnostics = getDeviceDiagnostics(device.id);
  const [syncing, setSyncing] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const runAction = async (label: string) => {
    setSyncing(true);
    setToastMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setToastMsg(label);
    } finally {
      setSyncing(false);
      setTimeout(() => setToastMsg(null), 2500);
    }
  };

  if (!diagnostics) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[{ label: "Devices", href: "/devices" }, { label: "Not found" }]}
        header={<DevicesPageTitle title="Device Diagnostics" subtitle="Device not found" />}
        headerActions={<DevicesHeaderActions />}
        width="full"
        className="space-y-5 pb-4"
      >
        <Card>
          <p className="text-sm text-foreground-muted">No device exists with ID "{device.id}".</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[
        { label: "Devices", href: "/devices" },
        { label: "Device Details", href: `/devices/${device.id}` },
      ]}
      header={
        <DevicesPageTitle
          title="Device Diagnostics"
          subtitle="Detailed telemetry, activity logs, and system settings for individual hardware nodes"
        />
      }
      headerActions={<DevicesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <DevicesGlobalSearch />

      {/* Device identity + stats */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-info-bg text-secondary">
                <Cpu className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-foreground">{device.name}</h2>
                <p className="text-xs text-foreground-muted">
                  Serial ID: {device.serial} • {device.id.toUpperCase().replace("DEV", "TF-")}
                </p>
              </div>
            </div>
            <Badge tone={diagnostics.online ? "success" : "danger"} variant="soft">
              {diagnostics.online ? "Device Online" : "Device Offline"}
            </Badge>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Device Type</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{diagnostics.deviceTypeLabel}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Assigned Location</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{diagnostics.assignedLocation}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Last Synced Time</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{diagnostics.lastSynced}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Firmware Version</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{diagnostics.firmwareVersion}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              loading={syncing}
              onClick={() => runAction("Remote sync triggered")}
              className="bg-cta text-white hover:bg-cta-hover"
            >
              Trigger Remote Sync
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Zap className="h-4 w-4" />}
              disabled={syncing}
              onClick={() => runAction("Hardware controller restart queued")}
            >
              Restart Hardware Controller
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Wrench className="h-4 w-4" />}
              disabled={syncing}
              onClick={() => runAction("Camera module calibration started")}
            >
              Calibrate Camera Module
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              disabled={syncing}
              onClick={() => runAction("Device cache wiped")}
            >
              Wipe Device Cache
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Pencil className="h-4 w-4" />}
              href={`/devices/${device.id}/edit`}
            >
              Edit
            </Button>
          </div>
          {toastMsg && (
            <p className="mt-3 rounded-md bg-success-bg px-3 py-2 text-xs font-semibold text-success" role="status">
              {toastMsg}
            </p>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Today&apos;s Verification Events</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{diagnostics.verificationEvents}</p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Pending Local Sync Queue</p>
            <p
              className={cn(
                "mt-2 text-3xl font-bold tabular-nums",
                diagnostics.pendingQueue > 0 ? "text-warning" : "text-foreground"
              )}
            >
              {diagnostics.pendingQueue}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Failed Log Transmissions</p>
            <p
              className={cn(
                "mt-2 text-3xl font-bold",
                diagnostics.failedIncidents > 0 ? "text-danger" : "text-success"
              )}
            >
              {diagnostics.failedIncidents} Incidents
            </p>
          </Card>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-subheading">Device Uptime (30d)</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-secondary">{diagnostics.uptime30d}%</p>
          </Card>
        </div>
      </div>

      {/* Diagnostic feed */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h3 className="text-sm font-bold text-foreground">Recent Live Diagnostic Feed</h3>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
            Listening Live
          </span>
        </div>
        <ul className="divide-y divide-border">
          {diagnostics.events.map((ev) => (
            <li key={ev.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <span className="w-16 shrink-0 text-xs font-semibold tabular-nums text-foreground-secondary">{ev.time}</span>
              <Badge tone={categoryTone[ev.category]} variant="soft" className="w-28 justify-center">
                {ev.category}
              </Badge>
              <span className="min-w-0 flex-1 text-[13px] text-foreground-secondary">{ev.message}</span>
              <Badge tone={resultTone[ev.result]} variant="soft">
                {ev.result}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </DashboardLayout>
  );
}
