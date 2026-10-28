"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  EmployeeForm,
  EmployeesPageTitle,
  EmployeesHeaderActions,
  EmployeesGlobalSearch,
} from "@/components/features/employees";
import { getEmployeeById } from "@/lib/mock-employees";

function EditEmployeeContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const employee = getEmployeeById(params.id);

  const handleSubmit = async () => {
    // Mock update — wire to API later.
    router.push("/employees");
  };

  if (!employee) {
    return (
      <DashboardLayout
        guarded={false}
        header={<EmployeesPageTitle title="Edit Employee" subtitle="Employee not found" />}
        headerActions={<EmployeesHeaderActions />}
        width="full"
        className="space-y-5 pb-4"
      >
        <EmptyState
          title="Employee not found"
          description={`No employee exists with ID "${params.id}". It may have been removed.`}
          action={
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />} href="/employees">
              Back to Employees
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      guarded={false}
      header={
        <EmployeesPageTitle
          title="Edit Employee"
          subtitle={`Editing profile for: ${employee.fullName} • ID: ${employee.id}`}
        />
      }
      headerActions={<EmployeesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <EmployeesGlobalSearch />
      <EmployeeForm mode="edit" employee={employee} onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}

export default function EditEmployeePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <EditEmployeeContent />
    </React.Suspense>
  );
}
