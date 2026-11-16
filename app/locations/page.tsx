"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LocationsTable,
  LocationsPageTitle,
  LocationsHeaderActions,
  LocationsGlobalSearch,
} from "@/components/features/locations";
import { mockLocations } from "@/lib/mock-locations";
import type { LocationListItem } from "@/types/locations";

export default function LocationsPage() {
  const [locations, setLocations] = React.useState<LocationListItem[]>(mockLocations);

  const handleDelete = async (location: LocationListItem) => {
    setLocations((prev) => prev.filter((l) => l.id !== location.id));
  };

  return (
    <DashboardLayout
      guarded={false}
      header={
        <LocationsPageTitle
          title="Locations"
          subtitle="Manage geographic enterprise nodes, geofencing parameters, and physical industrial scanners"
        />
      }
      headerActions={<LocationsHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <LocationsGlobalSearch />
      <LocationsTable locations={locations} onDelete={handleDelete} />
    </DashboardLayout>
  );
}
