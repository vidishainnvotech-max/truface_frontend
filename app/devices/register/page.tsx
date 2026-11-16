"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  DeviceForm,
  DevicesPageTitle,
  DevicesHeaderActions,
  DevicesGlobalSearch,
} from "@/components/features/devices";
import type { DeviceFormValues } from "@/types/devices";

export default function RegisterDevicePage() {
  const router = useRouter();

  const handleSubmit = async (_values: DeviceFormValues) => {
    // Mock register — wire to API later.
    router.push("/devices");
  };

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[{ label: "Devices", href: "/devices" }, { label: "Register New Device" }]}
      header={
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <DevicesPageTitle
            title="Register New Device"
            subtitle="Add a new biometric terminal to your plant and establish secure authentication"
          />
          <Badge tone="success" variant="soft" className="ml-auto shrink-0">
            Primary Server: Connected
          </Badge>
        </div>
      }
      headerActions={<DevicesHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <DevicesGlobalSearch />
      <DeviceForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push("/devices")} />
    </DashboardLayout>
  );
}
