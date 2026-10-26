"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { ConfirmDialog, EmptyState, PageHeader, SectionHeader, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Feedback";
import { useToast } from "@/components/ui/Toast";
import { OrgEntityFormModal } from "./OrgEntityFormModal";
import { orgDetailValue, orgEntityConfigs, orgGroups, type OrgEntityConfig } from "@/config/organization";
import { countOrgChildren, createOrgRenderCtx, deleteOrgRow, saveOrgRow, useOrgStore } from "@/lib/org-store";
import type { OrgEntityKey, OrgRow } from "@/types/organization";
import type { Tenant } from "@/types/tenants";
import type { Status } from "@/types/common";

export interface OrgCompanyWorkspaceProps {
  tenant: Tenant;
  companyId: string;
}

/** Quick-add order: physical setup first (the common flow), then the rest. */
const QUICK_ADD_ORDER: OrgEntityKey[] = [
  "locations",
  "buildings",
  "floors",
  "zones",
  "gates",
  "doors",
  "legal_entities",
  "business_units",
  "branches",
  "plants",
  "departments",
  "cost_centres",
  "grades",
  "designations",
];

function rowTitle(row: OrgRow): string {
  return String(row.code ?? row.name ?? row.legal_name ?? `#${String(row.id)}`);
}

/** 1–2 reference context lines ("Location · LOC-001 · Pune Plant Campus"). */
function contextLines(entity: OrgEntityKey, row: OrgRow, ctx: ReturnType<typeof createOrgRenderCtx>) {
  return orgEntityConfigs[entity].fields
    .filter((f) => f.ref && f.ref !== "companies" && row[f.name] !== null && row[f.name] !== undefined && row[f.name] !== "")
    .slice(0, 2)
    .map((f) => ({ key: f.name, label: f.label, value: String(orgDetailValue(f, row, ctx)) }));
}

interface RecordCardProps {
  entity: OrgEntityKey;
  row: OrgRow;
  ctx: ReturnType<typeof createOrgRenderCtx>;
  onView: (entity: OrgEntityKey, row: OrgRow) => void;
  onEdit: (entity: OrgEntityKey, row: OrgRow) => void;
  onDelete: (entity: OrgEntityKey, row: OrgRow) => void;
}

function WorkspaceRecordCard({ entity, row, ctx, onView, onEdit, onDelete }: RecordCardProps) {
  const config = orgEntityConfigs[entity];
  const lines = contextLines(entity, row, ctx);
  const name = String(row.name ?? row.legal_name ?? rowTitle(row));

  return (
    <div className="rounded-md border border-border bg-surface-muted p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-foreground-muted">{rowTitle(row)}</p>
        </div>
        <StatusBadge status={(row.status as Status) ?? "active"} variant="text" />
      </div>
      {lines.map((line) => (
        <p key={line.key} className="mt-1 truncate text-xs text-foreground-muted">
          <span className="font-medium text-foreground-secondary">{line.label}:</span> {line.value}
        </p>
      ))}
      <div className="mt-2 flex justify-end gap-1">
        <Button variant="ghost" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={() => onView(entity, row)}>
          View
        </Button>
        {!config.readOnly && (
          <Button variant="ghost" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => onEdit(entity, row)}>
            Edit
          </Button>
        )}
        {!config.readOnly && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            className="text-danger hover:bg-danger-bg hover:text-danger"
            onClick={() => onDelete(entity, row)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

interface SectionCardProps extends Omit<RecordCardProps, "row"> {
  records: OrgRow[];
  onAdd: (entity: OrgEntityKey) => void;
}

function EntitySectionCard({ entity, records, ctx, onAdd, onView, onEdit, onDelete }: SectionCardProps) {
  const config = orgEntityConfigs[entity];
  return (
    <Card padding="md" className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">{config.label}</h3>
          <Badge tone="neutral" variant="soft" size="sm">
            {records.length}
          </Badge>
        </div>
        {!config.readOnly && (
          <Button variant="secondary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => onAdd(entity)}>
            Add
          </Button>
        )}
      </div>
      {records.length === 0 ? (
        <p className="py-1 text-xs text-foreground-muted">
          Nothing here yet — press <span className="font-medium text-foreground-secondary">Add</span> to create the first{" "}
          {config.singular.toLowerCase()}.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {records.map((row) => (
            <WorkspaceRecordCard
              key={String(row.id)}
              entity={entity}
              row={row}
              ctx={ctx}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

interface ModalState {
  config: OrgEntityConfig;
  initial: OrgRow | null;
  defaults: OrgRow | null;
}

/**
 * Company workspace: one friendly page per company with everything added
 * under it as cards — grouped by structure, physical setup, organization and
 * workforce — plus a quick-add row and per-section Add buttons. Clicking a
 * company name in the structure tree opens this page.
 */
export function OrgCompanyWorkspace({ tenant, companyId }: OrgCompanyWorkspaceProps) {
  const router = useRouter();
  const toast = useToast();
  const { rows, loading } = useOrgStore(tenant.id);
  const ctx = React.useMemo(() => createOrgRenderCtx(rows), [rows]);
  const [modal, setModal] = React.useState<ModalState | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<{ config: OrgEntityConfig; row: OrgRow } | null>(null);
  const [blockedDelete, setBlockedDelete] = React.useState<{ label: string; children: number } | null>(null);

  const backHref = `/tenants/${tenant.id}/architecture`;
  const company = rows.companies.find((r) => String(r.id) === companyId) ?? null;

  const inCompany = (entity: OrgEntityKey): OrgRow[] =>
    rows[entity]
      .filter((r) => r.company_id !== null && r.company_id !== undefined && String(r.company_id) === companyId)
      .slice()
      .sort((a, b) => rowTitle(a).localeCompare(rowTitle(b)));

  const counts = QUICK_ADD_ORDER.map((key) => ({ key, count: inCompany(key).length }));
  const totalRecords = counts.reduce((sum, c) => sum + c.count, 0);

  const openAdd = (entity: OrgEntityKey) => {
    const config = orgEntityConfigs[entity];
    if (config.readOnly) return;
    setModal({ config, initial: null, defaults: { company_id: companyId } });
  };

  const openEdit = (entity: OrgEntityKey, row: OrgRow) =>
    setModal({ config: orgEntityConfigs[entity], initial: row, defaults: null });

  const openDelete = (entity: OrgEntityKey, row: OrgRow) => {
    const config = orgEntityConfigs[entity];
    if (config.readOnly) return;
    // Block deleting a parent while children still reference it.
    const children = countOrgChildren(rows, entity, row.id);
    if (children > 0) {
      setBlockedDelete({ label: `${config.singular} "${rowTitle(row)}"`, children });
      return;
    }
    setPendingDelete({ config, row });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { config, row } = pendingDelete;
    const label = rowTitle(row);
    try {
      await deleteOrgRow(config.key, row);
      toast.success(`${config.singular} "${label}" deleted`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to delete ${config.singular.toLowerCase()}.`);
    } finally {
      setPendingDelete(null);
    }
  };

  const handleSave = async (saved: OrgRow) => {
    if (!modal) return;
    const { config, initial } = modal;
    const persisted = await saveOrgRow(config.key, saved, tenant.id);
    const label = rowTitle(persisted);
    setModal(null);
    toast.success(
      initial ? `${config.singular} "${label}" updated successfully` : `${config.singular} "${label}" added under this company`
    );
  };

  const onView = (entity: OrgEntityKey, row: OrgRow) =>
    router.push(`/tenants/${tenant.id}/architecture/${entity}/${String(row.id)}`);

  const overviewFields = company
    ? (() => {
        const withValues = orgEntityConfigs.companies.fields.filter((f) => {
          const v = company[f.name];
          return v !== null && v !== undefined && v !== "";
        });
        return [
          ...withValues.filter((f) => ["code", "name", "legal_name", "status"].includes(f.name)),
          ...withValues.filter((f) => !["code", "name", "legal_name", "status"].includes(f.name)),
        ].slice(0, 8);
      })()
    : [];

  const companyHeading = company ? rowTitle(company) : "Company";

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: "Tenants", href: "/tenants" },
        { label: tenant.name, href: `/tenants/${tenant.id}` },
        { label: "Architecture", href: backHref },
        { label: companyHeading },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={company ? `${String(company.name ?? companyHeading)} · Workspace` : "Company Workspace"}
          description={
            company
              ? `Everything added under this company — ${totalRecords} ${totalRecords === 1 ? "record" : "records"} across structure, sites and workforce.`
              : "Loading company…"
          }
          actions={
            <Button
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push(backHref)}
            >
              Back to Structure
            </Button>
          }
        />

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          </div>
        ) : !company ? (
          <Card padding="lg">
            <EmptyState
              title="Company not found"
              description="This company may have been deleted, or the link was opened in a fresh session before the structure was reloaded."
              action={
                <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.push(backHref)}>
                  Back to Structure
                </Button>
              }
            />
          </Card>
        ) : (
          <>
            {/* Overview */}
            <Card padding="lg">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{String(company.name ?? companyHeading)}</h2>
                    <StatusBadge status={(company.status as Status) ?? "active"} />
                  </div>
                  {company.legal_name ? (
                    <p className="mt-0.5 text-sm text-foreground-muted">{String(company.legal_name)}</p>
                  ) : null}
                </div>
                <Button variant="secondary" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />} onClick={() => openEdit("companies", company)}>
                  Edit Company
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                {overviewFields
                  .filter((f) => f.name !== "name" && f.name !== "legal_name" && f.name !== "status")
                  .map((f) => (
                    <div key={f.name} className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{f.label}</p>
                      <p className="mt-0.5 break-words text-sm text-foreground">{orgDetailValue(f, company, ctx)}</p>
                    </div>
                  ))}
              </div>

              {/* Counts */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {totalRecords === 0 ? (
                  <p className="text-xs text-foreground-muted">Nothing set up under this company yet — start with the quick add below.</p>
                ) : (
                  counts
                    .filter((c) => c.count > 0)
                    .map((c) => (
                      <Badge key={c.key} tone="neutral" variant="soft" size="md">
                        {c.count} {orgEntityConfigs[c.key].label}
                      </Badge>
                    ))
                )}
              </div>
            </Card>

            {/* Quick add */}
            <Card padding="md">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Add to this company</h3>
                  <p className="text-xs text-foreground-muted">Pick what you want to set up — the form arrives with this company preselected.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_ADD_ORDER.map((key) => {
                  const config = orgEntityConfigs[key];
                  if (config.readOnly) return null;
                  return (
                    <Button
                      key={key}
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                      onClick={() => openAdd(key)}
                    >
                      {config.singular}
                    </Button>
                  );
                })}
              </div>
            </Card>

            {/* Grouped card sections */}
            {orgGroups.map((group) => {
              const entities = group.entities.filter((e) => e !== "companies" && !orgEntityConfigs[e].readOnly);
              return (
                <div key={group.key} className="space-y-4">
                  <SectionHeader
                    title={group.label}
                    description={entities
                      .map((e) => `${inCompany(e).length} ${orgEntityConfigs[e].label.toLowerCase()}`)
                      .join(" · ")}
                  />
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {entities.map((entity) => (
                      <EntitySectionCard
                        key={entity}
                        entity={entity}
                        records={inCompany(entity)}
                        ctx={ctx}
                        onAdd={openAdd}
                        onView={onView}
                        onEdit={openEdit}
                        onDelete={openDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {modal && company && (
        <OrgEntityFormModal
          open
          config={modal.config}
          allRows={rows}
          initial={modal.initial}
          defaults={modal.defaults}
          tenantKey={tenant.id}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        tone="danger"
        confirmLabel="Delete"
        title={`Delete ${pendingDelete?.config.singular.toLowerCase()} "${pendingDelete ? rowTitle(pendingDelete.row) : ""}"?`}
        description="This removes the record from the tenant's structure. This action cannot be undone."
      />

      <ConfirmDialog
        open={Boolean(blockedDelete)}
        onClose={() => setBlockedDelete(null)}
        onConfirm={() => setBlockedDelete(null)}
        tone="primary"
        confirmLabel="Got it"
        cancelLabel="Close"
        title="Cannot delete — records still linked"
        description={
          blockedDelete
            ? `${blockedDelete.label} still has ${blockedDelete.children} linked ${blockedDelete.children === 1 ? "record" : "records"} under it. Delete or detach those first.`
            : undefined
        }
      />
    </DashboardLayout>
  );
}
