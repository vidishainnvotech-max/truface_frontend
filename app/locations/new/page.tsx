"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LocationForm,
  LocationsPageTitle,
  LocationsHeaderActions,
  LocationsGlobalSearch,
} from "@/components/features/locations";

export default function NewLocationPage() {
  const router = useRouter();

  const handleSubmit = async () => {
    // Mock create — wire to API later.
    router.push("/locations");
  };

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[{ label: "Locations", href: "/locations" }, { label: "Add Location" }]}
      header={
        <LocationsPageTitle
          title="Create New Location Node"
          subtitle="Setup virtual geofences, core operational times, and biometric thermal scanners"
        />
      }
      headerActions={<LocationsHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <LocationsGlobalSearch />
      <LocationForm mode="create" onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}
