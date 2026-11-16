"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  DevicesListTable,
  DevicesPageTitle,
  DevicesHeaderActions,
  DevicesGlobalSearch,
} from "@/components/features/devices";
import { mockDeviceList } from "@/lib/mock-devices";
import type { DeviceListItem } from "@/types/devices";

export default function DevicesPage() {
  const [devices, setDevices] = React.useState<DeviceListItem[]>(mockDeviceList);

  const handleDelete = async (device: DeviceListItem) => {
    setDevices((prev) => prev.filter((d) => d.id !== device.id));
  };

  return (
    <DashboardLayout
      guarded={false}
      header={
        <DevicesPageTitle
          title="Connected Devices"
          subtitle="Manage and monitor physical authentication nodes across your manufacturing plants"
        />
      }
      headerActions={<DevicesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <DevicesGlobalSearch />
      <DevicesListTable devices={devices} onDelete={handleDelete} />
    </DashboardLayout>
  );
}
