"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  LocationTrackingPanel,
  LocationsPageTitle,
  LocationsHeaderActions,
} from "@/components/features/locations";
import { getLocationById } from "@/lib/mock-locations";

function LocationTrackingContent() {
  const params = useParams<{ id: string }>();
  const location = getLocationById(params.id);

  if (!location) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[
          { label: "Locations", href: "/locations" },
          { label: "Live Tracking" },
        ]}
        header={
          <LocationsPageTitle title="Operative GIS Tracking" subtitle="Location not found" />
        }
        headerActions={<LocationsHeaderActions />}
        width="full"
        className="space-y-5 pb-4"
      >
        <EmptyState
          title="Location not found"
          description={`No location exists with ID "${params.id}". It may have been removed.`}
          action={
            <Button leftIcon={<ArrowLeft className="h-4 w-4" />} href="/locations">
              Back to Locations
            </Button>
          }
        />
      </DashboardLayout>
    );
  }

  return <LocationTrackingPanel location={location} />;
}

export default function LocationTrackingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <LocationTrackingContent />
    </React.Suspense>
  );
}
