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
import {
  locationStatusLabels,
  locationStatusOptions,
  locationTypeLabels,
  locationTypeOptions,
} from "@/config/location-options";
import type { Column, SortState } from "@/types/table";
import type { LocationListItem, LocationStatus, LocationType } from "@/types/locations";

type TypeFilter = LocationType | "all";
type StatusFilter = LocationStatus | "all";

export interface LocationsTableProps {
  locations: LocationListItem[];
  loading?: boolean;
  pageSize?: number;
  onDelete?: (location: LocationListItem) => Promise<void> | void;
}

function formatDevices(loc: LocationListItem) {
  if (loc.devicesOffline > 0 && loc.devicesActive === 0) {
    return `${loc.devicesOffline} Offline`;
  }
  if (loc.devicesActive > 0 && loc.devicesOffline === 0) {
    return `${loc.devicesActive} Active`;
  }
  return `${loc.devicesActive} Active · ${loc.devicesOffline} Offline`;
}

export function LocationsTable({ locations, loading, pageSize = 8, onDelete }: LocationsTableProps) {
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<TypeFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<LocationListItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const hasFilters = search !== "" || type !== "all" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = locations.filter((loc) => {
      const typeLabel = (locationTypeLabels[loc.type] ?? loc.type).toLowerCase();
      return (
        (!q ||
          loc.id.toLowerCase().includes(q) ||
          loc.name.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q) ||
          typeLabel.includes(q)) &&
        (type === "all" || loc.type === type) &&
        (status === "all" || loc.status === status)
      );
    });
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key as keyof LocationListItem];
        const bv = b[sort.key as keyof LocationListItem];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [locations, search, type, status, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<LocationListItem>[] = [
    {
      key: "name",
      header: "Location Name",
      sortable: true,
      render: (loc) => (
        <Link
          href={`/locations/${loc.id}`}
          className="font-semibold text-cta underline-offset-2 transition-colors hover:text-cta-hover hover:underline"
        >
          {loc.name}
        </Link>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      className: "text-foreground-secondary",
      render: (loc) => locationTypeLabels[loc.type] ?? loc.type,
    },
    {
      key: "address",
      header: "Address",
      className: "text-foreground-secondary",
      truncateWidth: "18rem",
    },
    {
      key: "employees",
      header: "Employees",
      sortable: true,
      align: "right",
      className: "font-semibold tabular-nums text-foreground",
    },
    {
      key: "devices",
      header: "Devices",
      align: "right",
      className: "text-foreground-secondary tabular-nums",
      render: (loc) => formatDevices(loc),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (loc) => (
        <Badge tone={loc.status === "active" ? "success" : "danger"} variant="text">
          {locationStatusLabels[loc.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      width: "120px",
      render: (loc) => (
        <RowActions
          actions={[
            { label: "View Details", icon: <Eye />, href: `/locations/${loc.id}`, tone: "primary" },
            { label: "Edit", icon: <Pencil />, href: `/locations/${loc.id}/edit`, tone: "primary" },
            {
              label: "Delete",
              icon: <Trash2 />,
              tone: "danger",
              onClick: onDelete ? () => setPendingDelete(loc) : undefined,
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
      toast.success(`Location "${target.name}" deleted`);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-80">
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search location..."
              inputSize="sm"
            />
          </div>
          <FilterSelect<TypeFilter>
            label="Type"
            value={type}
            onChange={(v) => {
              setType(v);
              setPage(1);
            }}
            options={[{ label: "All Nodes", value: "all" }, ...locationTypeOptions]}
          />
          <FilterSelect<StatusFilter>
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[{ label: "All", value: "all" }, ...locationStatusOptions]}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                "inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-cta transition-colors hover:text-cta-hover hover:underline"
              )}
            >
              Clear Filters
            </button>
          )}
          <div className="ml-auto">
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} href="/locations/new" className="h-9 px-4">
              Add Location
            </Button>
          </div>
        </div>

        <DataTable<LocationListItem>
          columns={columns}
          data={paged}
          rowKey={(loc) => loc.id}
          loading={loading}
          sort={sort}
          onSortChange={setSort}
          emptyTitle="No locations found"
          emptyDescription="Try adjusting your search or filters, or add a new location."
          emptyAction={
            <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />} href="/locations/new">
              Add Location
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
        title={`Delete ${pendingDelete?.name ?? "location"}?`}
        description="This permanently removes the location node, its geofence settings and device associations. This action cannot be undone."
        confirmText={pendingDelete?.id}
        confirmLabel="Delete location"
      />
    </>
  );
}
