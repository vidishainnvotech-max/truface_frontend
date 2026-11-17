"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import {
  AttendancePageTitle,
  AttendanceHeaderActions,
  AttendanceGlobalSearch,
  LiveAttendanceTable,
} from "@/components/features/attendance";
import { mockLiveFeed } from "@/lib/mock-attendance";

export default function LiveAttendancePage() {
  const [lastUpdated, setLastUpdated] = React.useState("Just now");
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setLastUpdated("Just now");
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (tick === 0) return;
    const id = setTimeout(() => setLastUpdated("A few seconds ago"), 10_000);
    return () => clearTimeout(id);
  }, [tick]);

  return (
    <DashboardLayout
      guarded={false}
      header={
        <AttendancePageTitle
          title="Live Monitoring Terminal"
          subtitle="Continuous verification activity across all access control devices"
        />
      }
      headerActions={
        <AttendanceHeaderActions updatedLabel={`Last updated: ${lastUpdated}`} />
      }
      width="full"
      className="space-y-5 pb-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AttendanceGlobalSearch placeholder="Global Search — employees, locations, reports..." />
        <Badge tone="success" variant="soft" dot>
          Streaming
        </Badge>
      </div>

      <LiveAttendanceTable entries={mockLiveFeed} />
    </DashboardLayout>
  );
}
