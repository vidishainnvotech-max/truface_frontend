"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  AttendancePageTitle,
  AttendanceHeaderActions,
  AttendanceDetailsPanel,
} from "@/components/features/attendance";
import { getAttendanceRecord } from "@/lib/mock-attendance";

function AttendanceDetailContent() {
  const params = useParams<{ id: string }>();
  const details = getAttendanceRecord(params.id);

  if (!details) {
    return (
      <DashboardLayout
        guarded={false}
        header={<AttendancePageTitle title="Attendance Details" subtitle="Record not found" />}
        headerActions={<AttendanceHeaderActions />}
        width="full"
        className="space-y-5 pb-4"
      >
        <EmptyState
          title="Attendance record not found"
          description={`No attendance record exists with ID "${params.id}". It may have been removed.`}
          action={
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />} href="/attendance/records">
              Back to Attendance Records
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return <AttendanceDetailsPanel details={details} />;
}

export default function AttendanceDetailsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <AttendanceDetailContent />
    </React.Suspense>
  );
}
