"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import {
  EmployeesPageTitle,
  EmployeesHeaderActions,
  EmployeesGlobalSearch,
} from "./employees-page-chrome";
import { OverviewTab } from "./details/OverviewTab";
import { AttendanceLogsTab } from "./details/AttendanceLogsTab";
import { VerificationSetupTab } from "./details/VerificationSetupTab";
import { LocationMapTab } from "./details/LocationMapTab";
import { SystemActivityTab } from "./details/SystemActivityTab";
import { departmentLabels, locationLabels } from "@/config/employee-options";
import type { Employee, EmployeeDetails } from "@/types/employees";

const TAB_LABELS: Record<string, string> = {
  overview: "Overview",
  attendance: "Attendance Logs",
  verification: "Verification Setup",
  location: "Location Map",
  activity: "System Activity",
};

export interface EmployeeDetailsPanelProps {
  employee: Employee;
  details: EmployeeDetails;
}

export function EmployeeDetailsPanel({ employee, details }: EmployeeDetailsPanelProps) {
  const [tab, setTab] = React.useState("overview");

  const crumbs: { label: string; href?: string }[] = [
    { label: "Employees", href: "/employees" },
    { label: employee.fullName },
  ];
  if (tab !== "overview") crumbs.push({ label: TAB_LABELS[tab] });

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={crumbs}
      header={<EmployeesPageTitle title="Employee Details Panel" subtitle="" />}
      headerActions={<EmployeesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <EmployeesGlobalSearch />

      {/* Profile header card */}
      <div className="rounded-lg border border-border bg-info-bg/30 p-5">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={employee.fullName} size="xl" status={employee.status === "active" ? "online" : "offline"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-foreground">{employee.fullName}</h2>
              <Badge tone="info" variant="soft">
                {employee.employeeType === "factory" ? "Factory Staff" : "Field Staff"}
              </Badge>
              <Badge tone={employee.status === "active" ? "success" : "danger"} variant="soft" dot>
                {employee.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Employee ID</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{employee.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Department</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {departmentLabels[employee.department] ?? employee.department}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Default Location</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {locationLabels[employee.location] ?? employee.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        items={Object.entries(TAB_LABELS).map(([value, label]) => ({ value, label }))}
        value={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === "overview" && <OverviewTab employee={employee} details={details} />}
      {tab === "attendance" && <AttendanceLogsTab details={details} />}
      {tab === "verification" && <VerificationSetupTab employee={employee} details={details} />}
      {tab === "location" && <LocationMapTab employee={employee} details={details} />}
      {tab === "activity" && <SystemActivityTab details={details} />}
    </DashboardLayout>
  );
}
