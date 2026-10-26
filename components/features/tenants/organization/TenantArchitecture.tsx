"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { PageHeader, ConnectionBadge } from "@/components/common";
import { Card } from "@/components/ui/Card";
import { OrgStructureTree } from "./OrgStructureTree";
import { createOrgRenderCtx, useOrgStore } from "@/lib/org-store";
import type { Tenant } from "@/types/tenants";

export interface TenantArchitectureProps {
  tenant: Tenant;
}

/**
 * Tenant architecture page: the superadmin structure builder (tree of
 * add-forms from companies down to doors). The builder writes straight to
 * the org store — everything is set up directly, no approval queue.
 */
export function TenantArchitecture({ tenant }: TenantArchitectureProps) {
  const { rows, loading } = useOrgStore(tenant.id);
  const ctx = React.useMemo(() => createOrgRenderCtx(rows), [rows]);

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Tenants", href: "/tenants" },
        { label: tenant.name, href: `/tenants/${tenant.id}` },
        { label: "Architecture" },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={`Organization Architecture · ${tenant.name}`}
          description={`Build tenant ${tenant.code}'s structure — companies, sites, buildings, floors and access points.`}
          actions={<ConnectionBadge name="Primary Server" state="connected" />}
        />

        <Card padding="lg">
          <OrgStructureTree tenantKey={tenant.id} rows={rows} ctx={ctx} loading={loading} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
