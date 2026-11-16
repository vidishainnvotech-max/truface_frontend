"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import {
  LocationsPageTitle,
  LocationsHeaderActions,
  LocationsGlobalSearch,
} from "./locations-page-chrome";
import { WorkforceTab } from "./details/WorkforceTab";
import { GeofenceTab } from "./details/GeofenceTab";
import { locationTypeLabels } from "@/config/location-options";
import { getLocationDetails } from "@/lib/mock-locations";
import { MapPin, Pencil, Radar } from "lucide-react";
import type { LocationListItem } from "@/types/locations";

export interface LocationDetailsPanelProps {
  location: LocationListItem;
}

const TAB_LABELS: Record<string, string> = {
  employees: "Employees",
  geofence: "Geofence",
};

export function LocationDetailsPanel({ location }: LocationDetailsPanelProps) {
  const [tab, setTab] = React.useState("employees");
  const details = getLocationDetails(location);
  const devicesTotal = location.devicesActive + location.devicesOffline;

  const crumbs: { label: string; href?: string }[] = [
    { label: "Locations", href: "/locations" },
    { label: location.name },
  ];
  if (tab !== "employees") crumbs.push({ label: TAB_LABELS[tab] });

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={crumbs}
      header={<LocationsPageTitle title={location.name} subtitle={locationTypeLabels[location.type]} />}
      headerActions={
        <>
          <LocationsHeaderActions />
        </>
      }
      width="full"
      className="space-y-5 pb-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Pencil className="h-4 w-4" />}
          href={`/locations/${location.id}/edit`}
        >
          Edit Location
        </Button>
        <Button
          size="sm"
          leftIcon={<Radar className="h-4 w-4" />}
          href={`/locations/${location.id}/tracking`}
          className="bg-cta text-white hover:bg-cta-hover"
        >
          Live Tracking
        </Button>
      </div>

      <LocationsGlobalSearch />

      <StatGrid cols={4}>
        <StatCard
          label="Total Employees"
          value={location.employees}
          tone="info"
          icon={<MapPin className="h-5 w-5" />}
          footer={<Badge tone="info" variant="soft">Pune Registered</Badge>}
        />
        <StatCard
          label="Devices"
          value={`${devicesTotal} Node Scanners`}
          tone="primary"
          footer={
            <Badge tone={location.devicesOffline === 0 ? "success" : "warning"} variant="soft">
              {location.devicesActive}/{devicesTotal} Online
            </Badge>
          }
        />
        <StatCard
          label="Present Today"
          value={details.presentToday.toLocaleString("en-IN")}
          tone="success"
          footer={<Badge tone="success" variant="soft">Active Duty</Badge>}
        />
        <StatCard
          label="Attendance Rate"
          value={`${details.attendanceRate}%`}
          tone="accent"
          footer={<Badge tone="info" variant="soft">Target 90%</Badge>}
        />
      </StatGrid>

      <Tabs
        items={Object.entries(TAB_LABELS).map(([value, label]) => ({ value, label }))}
        value={tab}
        onChange={setTab}
        variant="underline"
      />

      {tab === "employees" && (
        <WorkforceTab
          workforce={details.workforce}
          presentToday={details.presentToday}
          locationName={location.name}
        />
      )}
      {tab === "geofence" && <GeofenceTab location={location} />}
    </DashboardLayout>
  );
}
