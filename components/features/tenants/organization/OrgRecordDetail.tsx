"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { PageHeader, SectionHeader, StatusBadge, EmptyState } from "@/components/common";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Feedback";
import { orgEntityConfigs, orgDetailValue } from "@/config/organization";
import { createOrgRenderCtx, useOrgStore } from "@/lib/org-store";
import { cn, formatDate } from "@/lib/utils";
import type { OrgEntityKey } from "@/types/organization";
import type { Tenant } from "@/types/tenants";
import type { Status } from "@/types/common";

export interface OrgRecordDetailProps {
  tenant: Tenant;
  entity: OrgEntityKey;
  recordId: string;
}

/** Read-only detail page for one organization record (companies → doors). */
export function OrgRecordDetail({ tenant, entity, recordId }: OrgRecordDetailProps) {
  const router = useRouter();
  const config = orgEntityConfigs[entity];
  const { rows, loading } = useOrgStore(tenant.id);
  const ctx = React.useMemo(() => createOrgRenderCtx(rows), [rows]);
  const record = rows[entity].find((r) => String(r.id) === recordId) ?? null;

  const backHref = `/tenants/${tenant.id}/architecture`;
  const heading = record
    ? `${config.singular} ${String(record.code ?? record.name ?? record.legal_name ?? `#${recordId}`)}`
    : config.singular;

  const systemEntries = record
    ? [
        { label: "Record ID", value: String(record.id ?? "") },
        { label: "Public ID", value: record.public_id ? String(record.public_id) : null },
        { label: "Tenant ID", value: record.tenant_id == null ? null : String(record.tenant_id) },
        { label: "Created At", value: record.created_at ? formatDate(String(record.created_at)) : null },
        { label: "Updated At", value: record.updated_at ? formatDate(String(record.updated_at)) : null },
      ].filter((e) => Boolean(e.value))
    : [];

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Tenants", href: "/tenants" },
        { label: tenant.name, href: `/tenants/${tenant.id}` },
        { label: "Architecture", href: backHref },
        { label: config.label, href: backHref },
        { label: heading },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={heading}
          description={record ? `${config.label} · ${String(record.public_id ?? "")}` : config.description}
          actions={
            <Button
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push(backHref)}
            >
              Back to Architecture
            </Button>
          }
        />

        <Card padding="lg">
          {loading ? (
            <div className="space-y-5">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            </div>
          ) : !record ? (
            <EmptyState
              title="Record not found"
              description="This record may have been deleted, or the link was opened in a fresh session before the structure was reloaded."
              action={
                <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.push(backHref)}>
                  Back to Architecture
                </Button>
              }
            />
          ) : (
            <div className="space-y-6">
              <SectionHeader
                title="Record Details"
                description={`Every field saved for this ${config.singular.toLowerCase()}.`}
              />
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {config.fields.map((field) => (
                  <div key={field.name} className={cn("min-w-0", field.className)}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{field.label}</p>
                    <div
                      className={cn(
                        "mt-1 break-words text-sm text-foreground",
                        (field.name === "code" || field.name === "public_id") && "font-mono"
                      )}
                    >
                      {field.name === "status" ? (
                        <StatusBadge status={(record.status as Status) ?? "active"} />
                      ) : (
                        orgDetailValue(field, record, ctx)
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {systemEntries.length > 0 && (
                <div className="border-t border-border pt-5">
                  <SectionHeader title="System" description="Generated and audit columns maintained by the platform." />
                  <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    {systemEntries.map((entry) => (
                      <div key={entry.label} className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{entry.label}</p>
                        <p className="mt-1 break-all font-mono text-sm text-foreground-secondary">{entry.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
