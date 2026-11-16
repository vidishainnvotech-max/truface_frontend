"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  DeviceDetailsPanel,
  DevicesPageTitle,
  DevicesHeaderActions,
} from "@/components/features/devices";
import { getDeviceListItem } from "@/lib/mock-devices";

function DeviceDetailContent() {
  const params = useParams<{ id: string }>();
  const device = getDeviceListItem(params.id);

  if (!device) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[{ label: "Devices", href: "/devices" }, { label: "Not found" }]}
        header={<DevicesPageTitle title="Device Diagnostics" subtitle="Device not found" />}
        headerActions={<DevicesHeaderActions />}
        width="full"
        className="space-y-5 pb-4"
      >
        <EmptyState
          title="Device not found"
          description={`No device exists with ID "${params.id}". It may have been removed.`}
          action={
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />} href="/devices">
              Back to Devices
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return <DeviceDetailsPanel device={device} />;
}

export default function DeviceDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <DeviceDetailContent />
    </React.Suspense>
  );
}
