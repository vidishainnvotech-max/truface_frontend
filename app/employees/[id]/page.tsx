"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { EmployeesPageTitle, EmployeesHeaderActions } from "@/components/features/employees";
import { EmployeeDetailsPanel } from "@/components/features/employees/EmployeeDetailsPanel";
import { getEmployeeById, getEmployeeDetails } from "@/lib/mock-employees";

function EmployeeDetailContent() {
  const params = useParams<{ id: string }>();
  const employee = getEmployeeById(params.id);
  const details = getEmployeeDetails(params.id);

  if (!employee || !details) {
    return (
      <DashboardLayout
        guarded={false}
        header={<EmployeesPageTitle title="Employee Details" subtitle="Employee not found" />}
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

  return <EmployeeDetailsPanel employee={employee} details={details} />;
}

export default function EmployeeDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <EmployeeDetailContent />
    </React.Suspense>
  );
}
