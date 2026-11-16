"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/common/EmptyState";
import {
  LocationForm,
  LocationsPageTitle,
  LocationsHeaderActions,
  LocationsGlobalSearch,
} from "@/components/features/locations";
import { getLocationById, locationToFormValues } from "@/lib/mock-locations";

function EditLocationContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const location = getLocationById(params.id);

  if (!location) {
    return (
      <DashboardLayout
        guarded={false}
        breadcrumbs={[{ label: "Locations", href: "/locations" }, { label: "Edit Location" }]}
        header={<LocationsPageTitle title="Edit Location" subtitle="Location not found" />}
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

  const handleSubmit = async () => {
    // Mock update — wire to API later.
    router.push(`/locations/${location.id}`);
  };

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[
        { label: "Locations", href: "/locations" },
        { label: location.name, href: `/locations/${location.id}` },
        { label: "Edit" },
      ]}
      header={
        <LocationsPageTitle
          title={`Edit ${location.name}`}
          subtitle="Update virtual geofences, operational times, and biometric edge devices"
        />
      }
      headerActions={<LocationsHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <LocationsGlobalSearch />
      <LocationForm
        mode="edit"
        initialValues={locationToFormValues(location)}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/locations/${location.id}`)}
      />
    </DashboardLayout>
  );
}

export default function EditLocationPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
        </div>
      }
    >
      <EditLocationContent />
    </React.Suspense>
  );
}
