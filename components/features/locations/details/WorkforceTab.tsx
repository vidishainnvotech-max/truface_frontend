"use client";

import { CreditCard, Fingerprint, ScanFace } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/common/DataTable";
import type { Column } from "@/types/table";
import type { LocationWorkforceRow } from "@/types/locations";

const methodMeta: Record<
  LocationWorkforceRow["method"],
  { label: string; tone: "info" | "primary" | "success"; icon: React.ReactNode }
> = {
  face: { label: "Face Verify", tone: "info", icon: <ScanFace className="h-3 w-3" /> },
  rfid: { label: "RFID Smartcard", tone: "primary", icon: <CreditCard className="h-3 w-3" /> },
  fingerprint: { label: "Fingerprint", tone: "success", icon: <Fingerprint className="h-3 w-3" /> },
};

export interface WorkforceTabProps {
  workforce: LocationWorkforceRow[];
  presentToday: number;
  locationName: string;
  pageSize?: number;
}

export function WorkforceTab({ workforce, presentToday, locationName, pageSize = 8 }: WorkforceTabProps) {
  const columns: Column<LocationWorkforceRow>[] = [
    {
      key: "name",
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="xs" />
          <div className="leading-tight">
            <span className="block text-[13px] font-semibold text-foreground">{row.name}</span>
            <span className="block text-[11px] text-foreground-muted">ID: {row.id}</span>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      className: "text-foreground-secondary",
    },
    {
      key: "method",
      header: "Verification",
      render: (row) => {
        const m = methodMeta[row.method];
        return (
          <Badge tone={m.tone} variant="soft" leftIcon={m.icon}>
            {m.label}
          </Badge>
        );
      },
    },
    {
      key: "checkIn",
      header: "Check-In",
      className: "tabular-nums text-foreground-secondary",
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (row) => (
        <Badge tone={row.status === "on-time" ? "success" : "warning"} variant="soft">
          {row.status === "on-time" ? "On Time" : "Late Entry"}
        </Badge>
      ),
    },
  ];

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cta" aria-hidden />
          <h3 className="text-sm font-bold text-foreground">Assigned Workforce</h3>
        </div>
        <Badge tone="success" variant="soft">
          {presentToday.toLocaleString("en-IN")} Present Duty
        </Badge>
      </div>

      <div className="px-5 pt-4">
        <DataTable<LocationWorkforceRow>
          columns={columns}
          data={workforce.slice(0, pageSize)}
          rowKey={(row) => row.id}
          striped
          emptyTitle="No workforce assigned"
          emptyDescription={`No employees are currently assigned to ${locationName}.`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-foreground-muted">
        <span>
          Total:{" "}
          <span className="font-semibold text-foreground">{presentToday.toLocaleString("en-IN")} employees</span>
        </span>
      </div>
    </Card>
  );
}
