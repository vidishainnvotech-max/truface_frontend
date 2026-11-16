"use client";

import * as React from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { FilterSelect } from "@/components/common/FilterSelect";
import { RowActions } from "@/components/common/RowActions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { Column, SortState } from "@/types/table";
import type { DeviceListItem, DeviceListStatus, DeviceScanMode } from "@/types/devices";

type StatusFilter = DeviceListStatus | "all";
type TypeFilter = DeviceScanMode | "all";

const typeLabels: Record<DeviceScanMode, string> = {
  "face-rfid": "Face+RFID",
  fingerprint: "Fingerprint",
  "rfid-only": "RFID Only",
};

const statusMeta: Record<DeviceListStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
  online: { label: "Online", tone: "success" },
  warning: { label: "Warning", tone: "warning" },
  offline: { label: "Offline", tone: "danger" },
};

const typeOptions: { label: string; value: TypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Face+RFID", value: "face-rfid" },
  { label: "Fingerprint", value: "fingerprint" },
  { label: "RFID Only", value: "rfid-only" },
];

const statusOptions: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Online", value: "online" },
  { label: "Warning", value: "warning" },
  { label: "Offline", value: "offline" },
];

const locationOptions = [
  { label: "All", value: "all" },
  { label: "Pune Assembly Line", value: "Pune Assembly Line" },
  { label: "Chennai Hub", value: "Chennai Hub" },
  { label: "Mumbai HQ", value: "Mumbai HQ" },
];

export interface DevicesListTableProps {
  devices: DeviceListItem[];
  loading?: boolean;
  pageSize?: number;
  onDelete?: (device: DeviceListItem) => Promise<void> | void;
}

export function DevicesListTable({ devices, loading, pageSize = 8, onDelete }: DevicesListTableProps) {
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [location, setLocation] = React.useState("all");
  const [type, setType] = React.useState<TypeFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<DeviceListItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const hasFilters = search !== "" || location !== "all" || type !== "all" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setType("all");
    setStatus("all");
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = devices.filter((d) => {
      const typeLabel = typeLabels[d.typeLabel].toLowerCase();
      return (
        (!q ||
          d.name.toLowerCase().includes(q) ||
          d.serial.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          typeLabel.includes(q)) &&
        (location === "all" || d.location === location) &&
        (type === "all" || d.typeLabel === type) &&
        (status === "all" || d.status === status)
      );
    });
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key as keyof DeviceListItem];
        const bv = b[sort.key as keyof DeviceListItem];
        const cmp =
          typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [devices, search, location, type, status, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<DeviceListItem>[] = [
    {
      key: "name",
      header: "Device Name",
      sortable: true,
      render: (d) => (
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded bg-info-bg text-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M8 21h8" />
            </svg>
          </span>
          <div className="min-w-0 leading-tight">
            <Link
              href={`/devices/${d.id}`}
              className="block truncate text-[13px] font-semibold text-foreground underline-offset-2 hover:text-cta hover:underline"
            >
              {d.name}
            </Link>
            <span className="block text-[11px] text-foreground-muted">ID: {d.serial}</span>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      className: "text-foreground-secondary",
    },
    {
      key: "typeLabel",
      header: "Type",
      render: (d) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] text-foreground-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-cta" aria-hidden />
          {typeLabels[d.typeLabel]}
        </span>
      ),
    },
    {
      key: "lastSync",
      header: "Last Sync",
      sortable: true,
      className: "text-foreground-secondary tabular-nums",
    },
    {
      key: "pendingQueue",
      header: "Pending Queue",
      sortable: true,
      align: "right",
      className: "tabular-nums",
      render: (d) => (
        <span className={cn("text-[13px] font-medium", d.pendingQueue > 0 ? "text-warning" : "text-foreground-secondary")}>
          {d.pendingQueue} records
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (d) => (
        <Badge tone={statusMeta[d.status].tone} variant="text">
          {statusMeta[d.status].label}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      width: "110px",
      render: (d) => (
        <RowActions
          actions={[
            { label: "View Details", icon: <Eye />, href: `/devices/${d.id}`, tone: "primary" },
            { label: "Edit", icon: <Pencil />, href: `/devices/${d.id}/edit`, tone: "primary" },
            {
              label: "Delete",
              icon: <Trash2 />,
              tone: "danger",
              onClick: onDelete ? () => setPendingDelete(d) : undefined,
              hidden: !onDelete,
            },
          ]}
        />
      ),
    },
  ];

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    const target = pendingDelete;
    setDeleting(true);
    try {
      await onDelete(target);
      toast.success(`Device "${target.name}" deleted`);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-72">
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search device name..."
              inputSize="sm"
            />
          </div>
          <FilterSelect
            label="Location"
            value={location}
            onChange={(v) => {
              setLocation(v);
              setPage(1);
            }}
            options={locationOptions}
          />
          <FilterSelect<TypeFilter>
            label="Type"
            value={type}
            onChange={(v) => {
              setType(v);
              setPage(1);
            }}
            options={typeOptions}
          />
          <FilterSelect<StatusFilter>
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={statusOptions}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-cta transition-colors hover:text-cta-hover hover:underline"
            >
              Clear Filters
            </button>
          )}
          <div className="ml-auto">
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} href="/devices/register" className="h-9 px-4">
              Register Device
            </Button>
          </div>
        </div>

        <DataTable<DeviceListItem>
          columns={columns}
          data={paged}
          rowKey={(d) => d.id}
          loading={loading}
          sort={sort}
          onSortChange={setSort}
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
            total: filtered.length,
            onPageChange: setPage,
          }}
        />
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        tone="danger"
        title={`Delete ${pendingDelete?.name ?? "device"}?`}
        description="This permanently removes the device and its queued attendance records. This action cannot be undone."
        confirmText={pendingDelete?.serial}
        confirmLabel="Delete device"
      />
    </>
  );
}
