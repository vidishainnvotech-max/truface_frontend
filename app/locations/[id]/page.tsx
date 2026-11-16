"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  LocationDetailsPanel,
  LocationsPageTitle,
  LocationsHeaderActions,
} from "@/components/features/locations";
import { getLocationById } from "@/lib/mock-locations";

function LocationDetailContent() {
  const params = useParams<{ id: string }>();
  const location = getLocationById(params.id);

  if (!location) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[{ label: "Locations", href: "/locations" }, { label: "Not found" }]}
        header={<LocationsPageTitle title="Location Details" subtitle="Location not found" />}
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

  return <LocationDetailsPanel location={location} />;
}

export default function LocationDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <LocationDetailContent />
    </React.Suspense>
  );
}
