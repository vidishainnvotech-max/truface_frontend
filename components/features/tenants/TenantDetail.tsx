"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, MonitorSmartphone, Pencil, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { PageHeader, SectionHeader, StatusBadge, StatCard, StatGrid } from "@/components/common";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isolationLabels } from "@/config/tenant-options";
import { cn, formatDate } from "@/lib/utils";
import type { Tenant } from "@/types/tenants";

export interface TenantDetailProps {
  tenant: Tenant;
}

/** Read-only tenant overview: identity, stats and architecture. */
export function TenantDetail({ tenant }: TenantDetailProps) {
  const router = useRouter();

  const details: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: "Tenant Code", value: tenant.code, mono: true },
    { label: "Domain", value: tenant.domainSlug, mono: true },
    { label: "Status", value: <StatusBadge status={tenant.status} /> },
    { label: "Isolation", value: isolationLabels[tenant.isolation] ?? tenant.isolation },
    { label: "Timezone", value: tenant.timezone },
    { label: "Locale", value: tenant.locale },
    { label: "Region", value: tenant.region },
    { label: "Country", value: `${tenant.country} (${tenant.countryCode})` },
    { label: "Plan", value: tenant.plan },
    { label: "Created", value: formatDate(tenant.createdAt) },
  ];

  return (
    <DashboardLayout
      breadcrumbs={[{ label: "Tenants", href: "/tenants" }, { label: tenant.name }]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={tenant.name}
          description={`${tenant.code} · ${tenant.domainSlug}`}
          actions={
            <>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Pencil className="h-4 w-4" />}
                onClick={() => router.push(`/tenants/${tenant.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<LayoutGrid className="h-4 w-4" />}
                onClick={() => router.push(`/tenants/${tenant.id}/architecture`)}
              >
                Architecture
              </Button>
            </>
          }
        />

        <StatGrid cols={2}>
          <StatCard label="Users" value={tenant.users} icon={<Users />} tone="info" />
          <StatCard label="Devices" value={tenant.devices} icon={<MonitorSmartphone />} tone="accent" />
        </StatGrid>

        <Card padding="lg">
          <SectionHeader title="Tenant Details" description="Platform configuration for this tenant." />
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{d.label}</p>
                <p className={cn("mt-1 break-words text-sm text-foreground", d.mono && "font-mono")}>{d.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
