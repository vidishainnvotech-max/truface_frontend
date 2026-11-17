"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  AttendancePageTitle,
  AttendanceHeaderActions,
  AttendanceGlobalSearch,
  AttendanceRecordsTable,
} from "@/components/features/attendance";
import { mockAttendanceRecords } from "@/lib/mock-attendance";

export default function AttendanceRecordsPage() {
  return (
    <DashboardLayout
      guarded={false}
      header={
        <AttendancePageTitle
          title="Attendance Records"
          subtitle="Comprehensive logs of factory & field workforce attendance"
        />
      }
      headerActions={<AttendanceHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <AttendanceGlobalSearch />
      <AttendanceRecordsTable rows={mockAttendanceRecords} total={2847} />
    </DashboardLayout>
  );
}
