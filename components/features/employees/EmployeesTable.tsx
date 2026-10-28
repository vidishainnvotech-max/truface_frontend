"use client";

import * as React from "react";
import { CreditCard, Eye, Fingerprint, Plus, ScanFace, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { FilterSelect } from "@/components/common/FilterSelect";
import { RowActions } from "@/components/common/RowActions";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  departmentLabels,
  departmentOptions,
  employeeStatusLabels,
  employeeStatusOptions,
  employeeTypeLabels,
  employeeTypeOptions,
  locationLabels,
  locationOptions,
} from "@/config/employee-options";
import type { Column, SortState } from "@/types/table";
import type { Employee, EmployeeStatus, EmployeeType, VerificationMethod } from "@/types/employees";

type StatusFilter = EmployeeStatus | "all";
type TypeFilter = EmployeeType | "all";

const methodMeta: Record<VerificationMethod, { label: string; tone: "info" | "primary" | "success"; icon: React.ReactNode }> = {
  face: { label: "Face Verify", tone: "info", icon: <ScanFace className="h-3 w-3" /> },
  rfid: { label: "RFID Card", tone: "primary", icon: <CreditCard className="h-3 w-3" /> },
  fingerprint: { label: "Fingerprint", tone: "success", icon: <Fingerprint className="h-3 w-3" /> },
};

export interface EmployeesTableProps {
  employees: Employee[];
  loading?: boolean;
  pageSize?: number;
  onDelete?: (employee: Employee) => Promise<void> | void;
}

export function EmployeesTable({ employees, loading, pageSize = 8, onDelete }: EmployeesTableProps) {
  const toast = useToast();
  const [search, setSearch] = React.useState("");
  const [location, setLocation] = React.useState<string>("all");
  const [department, setDepartment] = React.useState<string>("all");
  const [employeeType, setEmployeeType] = React.useState<TypeFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortState | null>(null);
  const [page, setPage] = React.useState(1);
  const [pendingDelete, setPendingDelete] = React.useState<Employee | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const hasFilters = search !== "" || location !== "all" || department !== "all" || employeeType !== "all" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setDepartment("all");
    setEmployeeType("all");
    setStatus("all");
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = employees.filter((e) => {
      const deptLabel = (departmentLabels[e.department] ?? e.department).toLowerCase();
      return (
        (!q ||
          e.id.toLowerCase().includes(q) ||
          e.fullName.toLowerCase().includes(q) ||
          deptLabel.includes(q)) &&
        (location === "all" || e.location === location) &&
        (department === "all" || e.department === department) &&
        (employeeType === "all" || e.employeeType === employeeType) &&
        (status === "all" || e.status === status)
      );
    });
    if (sort) {
      rows = [...rows].sort((a, b) => {
        const av = a[sort.key as keyof Employee];
        const bv = b[sort.key as keyof Employee];
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [employees, search, location, department, employeeType, status, sort]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: Column<Employee>[] = [
    {
      key: "id",
      header: "Employee ID",
      sortable: true,
      width: "110px",
      render: (e) => <span className="font-mono text-[13px] font-semibold text-foreground">{e.id}</span>,
    },
    {
      key: "fullName",
      header: "Name",
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={e.fullName} size="xs" />
          <Link
            href={`/employees/${e.id}`}
            className="font-semibold text-foreground underline-offset-2 transition-colors hover:text-cta hover:underline"
          >
            {e.fullName}
          </Link>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (e) => (
        <div className="leading-tight">
          <span className="block text-[13px] font-medium text-foreground">
            {departmentLabels[e.department] ?? e.department}
          </span>
          <span className="block text-[11px] text-foreground-muted">{employeeTypeLabels[e.employeeType]}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      className: "text-foreground-secondary",
      render: (e) => locationLabels[e.location] ?? e.location,
    },
    {
      key: "method",
      header: "Method",
      render: (e) => {
        const m = methodMeta[e.method];
        return (
          <Badge tone={m.tone} variant="soft" leftIcon={m.icon}>
            {m.label}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (e) => (
        <Badge tone={e.status === "active" ? "success" : "danger"} variant="text">
          {employeeStatusLabels[e.status]}
        </Badge>
      ),
    },
    {
      key: "lastAttendance",
      header: "Last Attendance",
      className: "text-foreground-secondary tabular-nums",
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (e) => (
        <RowActions
          actions={[
            { label: "View Details", icon: <Eye />, href: `/employees/${e.id}`, tone: "primary" },
            { label: "Edit", icon: <Pencil />, href: `/employees/${e.id}/edit`, tone: "primary" },
            {
              label: "Delete",
              icon: <Trash2 />,
              tone: "danger",
              onClick: onDelete ? () => setPendingDelete(e) : undefined,
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
      toast.success(`Employee "${target.fullName}" deleted`);
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
              placeholder="Search by Employee ID, Name, or Department"
              inputSize="sm"
            />
          </div>
          <div className="ml-auto">
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} href="/employees/new" className="h-9 px-4">
              Add Employee
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect
            label="Location"
            value={location}
            onChange={(v) => {
              setLocation(v);
              setPage(1);
            }}
            options={[{ label: "All", value: "all" }, ...locationOptions]}
          />
          <FilterSelect
            label="Department"
            value={department}
            onChange={(v) => {
              setDepartment(v);
              setPage(1);
            }}
            options={[{ label: "All", value: "all" }, ...departmentOptions]}
          />
          <FilterSelect<TypeFilter>
            label="Employee Type"
            value={employeeType}
            onChange={(v) => {
              setEmployeeType(v);
              setPage(1);
            }}
            options={[{ label: "All", value: "all" }, ...employeeTypeOptions]}
          />
          <FilterSelect<StatusFilter>
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[{ label: "All", value: "all" }, ...employeeStatusOptions]}
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
        </div>

        <DataTable<Employee>
          columns={columns}
          data={paged}
          rowKey={(e) => e.id}
          loading={loading}
          sort={sort}
          onSortChange={setSort}
          emptyTitle="No employees found"
          emptyDescription="Try adjusting your search or filters, or add a new employee."
          emptyAction={
            <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />} href="/employees/new">
              Add Employee
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
        title={`Delete ${pendingDelete?.fullName ?? "employee"}?`}
        description="This permanently removes the employee profile, biometric enrolments and attendance history. This action cannot be undone."
        confirmText={pendingDelete?.id}
        confirmLabel="Delete employee"
      />
    </>
  );
}
