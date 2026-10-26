"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { deviceTypeLabels, deviceTypeOptions, tenantOptions } from "@/config/device-options";
import { Button } from "@/components/ui/Button";
import { TableLink } from "@/components/ui/Table";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar, TableToolbar } from "@/components/common/SearchBar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TruncateText } from "@/components/common/TruncateText";
import { FilterSelect } from "@/components/common/FilterSelect";
import { RowActions, crudActions } from "@/components/common/RowActions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { Column, SortState } from "@/types/table";
import type { Device, DeviceType } from "@/types/devices";
import type { Status } from "@/types/common";

type StatusFilter = Status | "all";
type DeviceTypeFilter = DeviceType | "all";

export interface DevicesTableProps {
  devices: Device[];
  total?: number;
  loading?: boolean;
  pageSize?: number;
  onDelete?: (device: Device) => Promise<void> | void;
}

export function DevicesTable({ devices, total, loading, pageSize = 8, onDelete }: DevicesTableProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [deviceType, setDeviceType] = React.useState<DeviceTypeFilter>("all");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Device | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = devices.filter(
      (d) =>
        (!q || d.name.toLowerCase().includes(q) || d.serial.toLowerCase().includes(q) || d.tenant.toLowerCase().includes(q)) &&
        (status === "all" || d.status === status) &&
        (deviceType === "all" || d.deviceType === deviceType)
    );
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key as keyof Device];
        const bv = b[sort.key as keyof Device];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [devices, search, status, deviceType, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<Device>[] = [
    {
      key: "serial",
      header: "Device ID",
      sortable: true,
      width: "110px",
      render: (d) => <TableLink href={`/devices/${d.id}`}>{d.serial}</TableLink>,
    },
    {
      key: "name",
      header: "Device Name / Model",
      sortable: true,
      render: (d) => (
        <div className="flex flex-col">
          <TruncateText className="font-medium text-foreground" maxWidth="14rem">{d.name}</TruncateText>
          <span className="text-xs text-foreground-muted">{d.model}</span>
        </div>
      ),
    },
    {
      key: "deviceType",
      header: "Type",
      render: (d) => (
        <span className="inline-flex items-center rounded-full bg-row-alt px-2.5 py-1 text-[11px] font-medium text-primary">
          {deviceTypeLabels[d.deviceType]}
        </span>
      ),
    },
    { key: "tenant", header: "Tenant", className: "text-foreground-secondary" },
    { key: "location", header: "Physical Location", className: "text-foreground-secondary" },
    { key: "status", header: "Status", render: (d) => <StatusBadge status={d.status} variant="soft" dot /> },
    {
      key: "lastSeen",
      header: "Last Sync / Attendance",
      sortable: true,
      render: (d) => <span className="text-foreground-secondary tabular-nums">{timeAgo(d.lastSeen)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (d) => (
        <RowActions
          actions={crudActions({
            editHref: `/devices/${d.id}/edit`,
            viewHref: `/devices/${d.id}`,
            onDelete: onDelete ? () => setPendingDelete(d) : undefined,
          })}
        />
      ),
    },
  ];

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DataTable<Device>
        columns={columns}
        data={paged}
        rowKey={(d) => d.id}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(d) => router.push(`/devices/${d.id}`)}
        emptyTitle="No devices found"
        emptyDescription="Try adjusting your search or filters, or register a new device."
        emptyAction={
          <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />} href="/devices/register">
            Register Device
          </Button>
        }
        pagination={{
          page,
          pageSize,
          total: total ?? filtered.length,
          onPageChange: setPage,
        }}
        toolbar={
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                placeholder="Search serial no. or device…"
                inputSize="sm"
              />
            }
            filters={
              <>
                <FilterSelect
                  label="Tenant"
                  value={status}
                  onChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                  options={[{ label: "All", value: "all" }, ...tenantOptions.map((o) => ({ label: o.label, value: o.value as StatusFilter }))]}
                />
                <FilterSelect<DeviceTypeFilter>
                  label="Type"
                  value={deviceType}
                  onChange={(v) => {
                    setDeviceType(v);
                    setPage(1);
                  }}
                  options={[{ label: "All", value: "all" }, ...deviceTypeOptions.map((o) => ({ label: o.label, value: o.value }))]}
                />
              </>
            }
            actions={
              <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />} href="/devices/register">
                Register Device
              </Button>
            }
          />
        }
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        tone="danger"
        title={`Delete ${pendingDelete?.name ?? "device"}?`}
        description="This permanently removes the device and its attendance records. This action cannot be undone."
        confirmText={pendingDelete?.serial}
        confirmLabel="Delete device"
      />
    </>
  );
}
