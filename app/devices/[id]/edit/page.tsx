"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  DeviceForm,
  DevicesPageTitle,
  DevicesHeaderActions,
  DevicesGlobalSearch,
} from "@/components/features/devices";
import { getDeviceListItem } from "@/lib/mock-devices";
import type { DeviceFormValues } from "@/types/devices";

function EditDeviceContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const device = getDeviceListItem(params.id);

  if (!device) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[{ label: "Devices", href: "/devices" }, { label: "Edit Device" }]}
        header={<DevicesPageTitle title="Edit Device" subtitle="Device not found" />}
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

  const handleSubmit = async (_values: DeviceFormValues) => {
    // Mock update — wire to API later.
    router.push(`/devices/${device.id}`);
  };

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[
        { label: "Devices", href: "/devices" },
        { label: device.name, href: `/devices/${device.id}` },
        { label: "Edit" },
      ]}
      header={
        <DevicesPageTitle
          title={`Edit ${device.name}`}
          subtitle="Update hardware assignment, network keys, and operational modes"
        />
      }
      headerActions={<DevicesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <DevicesGlobalSearch />
      <DeviceForm
        mode="edit"
        initialValues={{
          serial: device.serial,
          name: device.name,
          deviceType: "facial-reader",
          model: device.serial,
          tenantId: "TF001",
          location: device.location,
          floor: "Ground Floor",
          ipAddress: "192.168.1.101",
          macAddress: device.serial,
          connectionType: "ethernet",
          httpEndpoint: "https://api.trueface.in/v1",
          deviceSecretKey: "sk_live_abc123def456",
          apiEndpoint: "https://api.trueface.in/v2/devices",
          syncInterval: 15,
          authenticationMode: "hybrid-local-cloud",
          storageCapacity: "8GB/32GB",
          heartbeatMonitoring: true,
          autoFirmwareUpdate: true,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/devices/${device.id}`)}
      />
    </DashboardLayout>
  );
}

export default function EditDevicePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <EditDeviceContent />
    </React.Suspense>
  );
}
