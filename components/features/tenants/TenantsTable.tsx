"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { isolationLabels, isolationOptions, tenantStatusOptions } from "@/config/tenant-options";
import { Button } from "@/components/ui/Button";
import { TableLink } from "@/components/ui/Table";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar, TableToolbar } from "@/components/common/SearchBar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TruncateText } from "@/components/common/TruncateText";
import { FilterSelect } from "@/components/common/FilterSelect";
import { RowActions, crudActions } from "@/components/common/RowActions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { Column, SortState } from "@/types/table";
import type { IsolationMode, Tenant } from "@/types/tenants";
import type { Status } from "@/types/common";

type StatusFilter = Status | "all";
type IsolationFilter = IsolationMode | "all";

export interface TenantsTableProps {
  tenants: Tenant[];
  /** Total across all pages (for "Showing X of Y"). Defaults to tenants.length. */
  total?: number;
  loading?: boolean;
  pageSize?: number;
  onDelete?: (tenant: Tenant) => Promise<void> | void;
}

export function TenantsTable({ tenants, total, loading, pageSize = 8, onDelete }: TenantsTableProps) {
  const toast = useToast();
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [isolation, setIsolation] = React.useState<IsolationFilter>("all");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Tenant | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = tenants.filter(
      (t) =>
        (!q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)) &&
        (status === "all" || t.status === status) &&
        (isolation === "all" || t.isolation === isolation)
    );
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key as keyof Tenant];
        const bv = b[sort.key as keyof Tenant];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [tenants, search, status, isolation, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<Tenant>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      width: "90px",
      render: (t) => <TableLink href={`/tenants/${t.id}`}>{t.code}</TableLink>,
    },
    {
      key: "name",
      header: "Tenant Name",
      sortable: true,
      render: (t) => <TruncateText className="font-medium text-foreground" maxWidth="16rem">{t.name}</TruncateText>,
    },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} variant="text" /> },
    { key: "isolation", header: "Isolation", render: (t) => isolationLabels[t.isolation] },
    { key: "timezone", header: "Timezone", className: "text-foreground-secondary" },
    { key: "country", header: "Country", render: (t) => `${t.country} (${t.countryCode})` },
    { key: "createdAt", header: "Created", sortable: true, render: (t) => formatDate(t.createdAt), className: "text-foreground-secondary tabular-nums" },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (t) => (
        <RowActions
          actions={[
            {
              label: "Architecture",
              icon: <LayoutGrid />,
              href: `/tenants/${t.id}/architecture`,
              tone: "accent",
            },
            ...crudActions({
              editHref: `/tenants/${t.id}/edit`,
              viewHref: `/tenants/${t.id}`,
              onDelete: onDelete ? () => setPendingDelete(t) : undefined,
            }),
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
      toast.success(`Tenant "${target.code}" deleted`);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DataTable<Tenant>
        columns={columns}
        data={paged}
        rowKey={(t) => t.id}
        loading={loading}
        sort={sort}
        onSortChange={setSort}
        onRowClick={(t) => router.push(`/tenants/${t.id}`)}
        emptyTitle="No tenants found"
        emptyDescription="Try adjusting your search or filters, or add a new tenant."
        emptyAction={
          <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />} href="/tenants/new">
            Add Tenant
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
                placeholder="Search tenant name or code…"
                inputSize="sm"
              />
            }
            filters={
              <>
                <FilterSelect<StatusFilter>
                  label="Status"
                  value={status}
                  onChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                  options={[{ label: "All", value: "all" }, ...tenantStatusOptions]}
                />
                <FilterSelect<IsolationFilter>
                  label="Isolation"
                  value={isolation}
                  onChange={(v) => {
                    setIsolation(v);
                    setPage(1);
                  }}
                  options={[
                    { label: "All", value: "all" },
                    ...isolationOptions.map((o) => ({ label: isolationLabels[o.value], value: o.value })),
                  ]}
                />
              </>
            }
            actions={
              <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />} href="/tenants/new">
                Add Tenant
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
        title={`Delete ${pendingDelete?.name ?? "tenant"}?`}
        description="This permanently removes the tenant, its users, devices and attendance data. This action cannot be undone."
        confirmText={pendingDelete?.code}
        confirmLabel="Delete tenant"
      />
    </>
  );
}
