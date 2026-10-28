"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmployeeForm, EmployeesPageTitle, EmployeesHeaderActions, EmployeesGlobalSearch } from "@/components/features/employees";

export default function NewEmployeePage() {
  const router = useRouter();

  const handleSubmit = async () => {
    // Mock create — wire to API later.
    router.push("/employees");
  };

  return (
    <DashboardLayout
      guarded={false}
      header={
        <EmployeesPageTitle
          title="Add Employee"
          subtitle="Create a new workforce profile"
        />
      }
      headerActions={<EmployeesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <EmployeesGlobalSearch />
      <EmployeeForm mode="create" onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}
