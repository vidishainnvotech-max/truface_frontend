"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmployeesTable } from "@/components/features/employees";
import { EmployeesPageTitle, EmployeesHeaderActions, EmployeesGlobalSearch } from "@/components/features/employees";
import { mockEmployees } from "@/lib/mock-employees";
import type { Employee } from "@/types/employees";

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees);

  const handleDelete = async (employee: Employee) => {
    setEmployees((prev) => prev.filter((e) => e.id !== employee.id));
  };

  return (
    <DashboardLayout
      guarded={false}
      header={
        <EmployeesPageTitle
          title="Employees"
          subtitle="Manage workforce profiles, assignments, and security verification levels for workers"
        />
      }
      headerActions={<EmployeesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <EmployeesGlobalSearch />
      <EmployeesTable employees={employees} onDelete={handleDelete} />
    </DashboardLayout>
  );
}
