"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, ChevronRight, Eye, Network, Pencil, Plus, Trash2, Unlink } from "lucide-react";
import { ConfirmDialog, EmptyState, SectionHeader } from "@/components/common";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { OrgEntityFormModal } from "./OrgEntityFormModal";
import {
  orgDetailValue,
  orgEntityConfigs,
  orgTreeChildren,
  orgTreeHints,
  orgTreeParents,
  type OrgEntityConfig,
  type OrgRenderCtx,
} from "@/config/organization";
import { countOrgChildren, deleteOrgRow, saveOrgRow } from "@/lib/org-store";
import { cn } from "@/lib/utils";
import type { OrgEntityKey, OrgRow, OrgRowsByEntity } from "@/types/organization";

export interface OrgStructureTreeProps {
  /** Tenant public id (ULID) — store key, API scope, and detail-link base. */
  tenantKey: string;
  rows: OrgRowsByEntity;
  ctx: OrgRenderCtx;
  loading?: boolean;
}

/** FK column on `child` pointing at `parent` (from the entity config). */
function fkField(child: OrgEntityKey, parent: OrgEntityKey): string | null {
  return orgEntityConfigs[child].fields.find((f) => f.ref === parent)?.name ?? null;
}

/**
 * Resolve the tree parent of a row: first candidate in the specificity order
 * (orgTreeParents) whose FK is set AND whose entity actually lists this child
 * in orgTreeChildren — so rows render exactly once, at the deepest attachment.
 */
function ownerOf(entity: OrgEntityKey, row: OrgRow): { entity: OrgEntityKey; id: string | number } | null {
  if (entity === "companies") return null;
  for (const parent of orgTreeParents[entity] ?? []) {
    const fk = fkField(entity, parent);
    if (!fk) continue;
    const v = row[fk];
    if (v === null || v === undefined || v === "") continue;
    if (!(orgTreeChildren[parent] ?? []).includes(entity)) continue;
    return { entity: parent, id: v as string | number };
  }
  return null;
}

function childrenOf(rows: OrgRowsByEntity, parent: OrgEntityKey, parentId: unknown, child: OrgEntityKey): OrgRow[] {
  return rows[child].filter((r) => {
    const owner = ownerOf(child, r);
    return owner !== null && owner.entity === parent && String(owner.id) === String(parentId);
  });
}

/** Ancestor ids along the open path (company → … → direct parent). Ids may be numeric or public_id strings. */
type TreePath = Partial<Record<OrgEntityKey, string | number>>;

interface NodeProps {
  entity: OrgEntityKey;
  row: OrgRow;
  depth: number;
  path: TreePath;
  tenantKey: string;
  rows: OrgRowsByEntity;
  ctx: OrgRenderCtx;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  onAdd: (child: OrgEntityKey, parentEntity: OrgEntityKey, parentRow: OrgRow, path: TreePath) => void;
  onEdit: (entity: OrgEntityKey, row: OrgRow) => void;
  onView: (entity: OrgEntityKey, row: OrgRow) => void;
  onDelete: (entity: OrgEntityKey, row: OrgRow) => void;
}

function OrgTreeNode(props: NodeProps) {
  const { entity, row, depth, path, rows, ctx, expanded, onToggle } = props;
  const config = orgEntityConfigs[entity];
  const label = `${String(row.code ?? "")} · ${String(row.name ?? row.legal_name ?? "")}`.replace(/ · $/, "");
  const nodeKey = `${entity}:${String(row.id)}`;
  const isOpen = expanded.has(nodeKey);

  const childKeys = orgTreeChildren[entity] ?? [];
  // Sections render only when they hold records — the Add chips in the node
  // header remain the creation path, keeping empty branches quiet.
  const childGroups = childKeys
    .map((key) => ({ key, list: childrenOf(rows, entity, row.id, key) }))
    .filter((g) => g.list.length > 0);
  const totalChildren = childGroups.reduce((sum, g) => sum + g.list.length, 0);

  const detailFields = config.fields.filter((f) => {
    const v = row[f.name];
    return v !== null && v !== undefined && v !== "";
  });
  const visibleFields = [
    ...detailFields.filter((f) => ["code", "name", "legal_name", "status"].includes(f.name)),
    ...detailFields.filter((f) => !["code", "name", "legal_name", "status"].includes(f.name)),
  ].slice(0, 6);

  const nextPath: TreePath = { ...path, [entity]: row.id as string | number };

  return (
    <div className={cn(depth > 0 && "ml-4 border-l border-border pl-4 sm:ml-6 sm:pl-5", "space-y-3")}>
      <div className="rounded-lg border border-border bg-surface shadow-card">
        {/* Node header */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <button
            type="button"
            onClick={() => onToggle(nodeKey)}
            aria-expanded={isOpen}
            aria-label={isOpen ? `Collapse ${label}` : `Expand ${label}`}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground-muted hover:bg-surface-muted hover:text-foreground focus-visible:focus-ring"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-row-alt text-secondary [&>svg]:h-4 [&>svg]:w-4">
            {entity === "companies" ? <Building2 /> : <Network />}
          </span>
          {entity === "companies" ? (
            <button
              type="button"
              onClick={() => props.onView(entity, row)}
              className="min-w-0 rounded text-left focus-visible:focus-ring"
              title="Open company workspace"
            >
              <p className="truncate text-sm font-semibold text-foreground hover:text-secondary hover:underline decoration-dotted underline-offset-4">
                {label}
              </p>
              <p className="text-[11px] uppercase tracking-wider text-foreground-muted">Company · click to manage</p>
            </button>
          ) : (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{label}</p>
              <p className="text-[11px] uppercase tracking-wider text-foreground-muted">{config.singular}</p>
            </div>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <Badge tone="neutral" variant="soft" size="sm">
              {totalChildren} direct
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="h-3.5 w-3.5" />}
              onClick={() => props.onView(entity, row)}
            >
              View
            </Button>
            {!config.readOnly && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => props.onEdit(entity, row)}
              >
                Edit
              </Button>
            )}
            {!config.readOnly && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                className="text-danger hover:bg-danger-bg hover:text-danger"
                onClick={() => props.onDelete(entity, row)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Details + add buttons */}
        {isOpen && (
          <div className="px-4 py-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleFields.map((f) => (
                <div key={f.name} className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">{f.label}</p>
                  <p className="mt-0.5 break-words text-sm text-foreground">
                    {f.name === "status" ? (
                      <Badge tone="success" variant="soft">
                        {String(row.status ?? "active")}
                      </Badge>
                    ) : (
                      orgDetailValue(f, row, ctx)
                    )}
                  </p>
                </div>
              ))}
            </div>

            {childKeys.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-border pt-3">
                {orgTreeHints[entity] && (
                  <p className="text-xs leading-relaxed text-foreground-muted">
                    <span className="font-semibold text-foreground-secondary">Where things go: </span>
                    {orgTreeHints[entity]}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">
                    Add under this {config.singular.toLowerCase()}:
                  </span>
                  {childKeys.map((key) => {
                    const childConfig = orgEntityConfigs[key];
                    if (childConfig.readOnly) return null;
                    return (
                      <Button
                        key={key}
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="h-3.5 w-3.5" />}
                        onClick={() => props.onAdd(key, entity, row, nextPath)}
                      >
                        {childConfig.singular}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Child sections */}
      {isOpen &&
        childGroups.map(({ key, list }) => {
          const childConfig = orgEntityConfigs[key];
          return (
            <div key={key} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 rounded-md bg-surface-muted px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  {childConfig.label}
                </span>
                <Badge tone="neutral" variant="soft" size="sm">
                  {list.length}
                </Badge>
                {!childConfig.readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    className="ml-auto"
                    onClick={() => props.onAdd(key, entity, row, nextPath)}
                  >
                    Add {childConfig.singular}
                  </Button>
                )}
              </div>
              {list.map((child) => (
                <OrgTreeNode
                  key={`${key}:${String(child.id)}`}
                  entity={key}
                  row={child}
                  depth={depth + 1}
                  path={nextPath}
                  tenantKey={props.tenantKey}
                  rows={rows}
                  ctx={ctx}
                  expanded={expanded}
                  onToggle={onToggle}
                  onAdd={props.onAdd}
                  onEdit={props.onEdit}
                  onView={props.onView}
                  onDelete={props.onDelete}
                />
              ))}
            </div>
          );
        })}
    </div>
  );
}

interface ModalState {
  config: OrgEntityConfig;
  initial: OrgRow | null;
  defaults: OrgRow | null;
  /** Ancestor node keys to expand after a successful create. */
  revealKeys: string[];
}

/**
 * Superadmin structure builder: a tree of add-forms covering every org table,
 * from companies down to doors. The company is the mandatory root of the
 * hierarchy — until one exists, the builder only offers "Add Company"; every
 * other record is created under a company (or one of its descendants).
 * Adding a child prefills the full ancestor chain (company → … → direct
 * parent) so deep setup is one short form. Rows are written straight to the
 * org store (the approval queue is for tenant-submitted changes and stays
 * untouched). Everything — labels, fields, children — is driven by
 * orgEntityConfigs / orgTreeChildren keys.
 */
export function OrgStructureTree({ tenantKey, rows, ctx, loading }: OrgStructureTreeProps) {
  const router = useRouter();
  const toast = useToast();
  const [modal, setModal] = React.useState<ModalState | null>(null);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = React.useState<{ config: OrgEntityConfig; row: OrgRow } | null>(null);
  const [blockedDelete, setBlockedDelete] = React.useState<{ label: string; children: number } | null>(null);

  const onToggle = React.useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const openCompanyAdd = () =>
    setModal({ config: orgEntityConfigs.companies, initial: null, defaults: null, revealKeys: [] });

  const openAdd = (child: OrgEntityKey, parentEntity: OrgEntityKey, parentRow: OrgRow, path: TreePath) => {
    const config = orgEntityConfigs[child];
    if (config.readOnly) return;
    const defaults: OrgRow = {};
    if (child !== "companies") {
      // Cascade-prefill the entire ancestor chain: every ref column whose
      // target appears in the open path gets the ancestor's id, so e.g. a
      // Door added under a Gate arrives with company/location/zone/gate set.
      for (const f of config.fields) {
        if (!f.ref) continue;
        const ancestorId = path[f.ref];
        if (ancestorId !== undefined) defaults[f.name] = ancestorId;
      }
      // Direct parent (already in path, but guarantee it even on shallow adds).
      const fk = fkField(child, parentEntity);
      if (fk && defaults[fk] === undefined) defaults[fk] = parentRow.id;
    }
    const revealKeys = Object.entries(path).map(([entity, id]) => `${entity}:${id}`);
    setModal({
      config,
      initial: null,
      defaults: Object.keys(defaults).length ? defaults : null,
      revealKeys,
    });
  };

  const openEdit = (entity: OrgEntityKey, row: OrgRow) => {
    setModal({ config: orgEntityConfigs[entity], initial: row, defaults: null, revealKeys: [] });
  };

  const rowLabel = (row: OrgRow) =>
    String(row.code ?? row.name ?? row.legal_name ?? row.id);

  const openDelete = (entity: OrgEntityKey, row: OrgRow) => {
    const config = orgEntityConfigs[entity];
    if (config.readOnly) return;
    // Block deleting a parent while children still reference it — otherwise
    // the subtree would be orphaned (e.g. a location that still has buildings).
    const children = countOrgChildren(rows, entity, row.id);
    if (children > 0) {
      setBlockedDelete({ label: `${config.singular} "${rowLabel(row)}"`, children });
      return;
    }
    setPendingDelete({ config, row });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { config, row } = pendingDelete;
    const label = rowLabel(row);
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
    const { config, initial, revealKeys } = modal as ModalState;
    const persisted = await saveOrgRow(config.key, saved, tenantKey);
    const label = String(persisted.code ?? persisted.name ?? persisted.legal_name ?? "");
    setModal(null);
    // Reveal the new record: expand every ancestor on the path it was added from.
    if (!initial && revealKeys.length > 0) {
      setExpanded((prev) => {
        const next = new Set(prev);
        for (const key of revealKeys) next.add(key);
        return next;
      });
    }
    toast.success(
      initial
        ? `${config.singular} "${label}" updated successfully`
        : `${config.singular} "${label}" added to the structure`
    );
  };

  const companies = rows.companies;
  // The company is the mandatory root of the hierarchy: until one exists the
  // builder only offers "Add Company" — no other record can be created.
  const companyRequired = !loading && companies.length === 0;

  const rootNodes = React.useMemo(() => {
    const nodes: { entity: OrgEntityKey; row: OrgRow }[] = [];
    for (const key of Object.keys(orgEntityConfigs) as OrgEntityKey[]) {
      if (key === "companies" || orgEntityConfigs[key].readOnly) continue;
      for (const row of rows[key]) {
        if (ownerOf(key, row) === null) nodes.push({ entity: key, row });
      }
    }
    return nodes;
  }, [rows]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Structure Builder"
        description="Set up the tenant's full architecture exactly as the client will see it. Start by adding the company that belongs to this client — every unit, site, building, floor and access point hangs under a company."
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCompanyAdd}>
            Add Company
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : companyRequired ? (
        <EmptyState
          icon={<Building2 />}
          title="Add the company first"
          description="This client's architecture starts with a company. Add the company that belongs to this client — only then can you add its units, sites, buildings, floors and access points."
          action={
            <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openCompanyAdd}>
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <OrgTreeNode
              key={`companies:${String(company.id)}`}
              entity="companies"
              row={company}
              depth={0}
              path={{}}
              tenantKey={tenantKey}
              rows={rows}
              ctx={ctx}
              expanded={expanded}
              onToggle={onToggle}
              onAdd={openAdd}
              onEdit={openEdit}
              onView={(entity, row) =>
                router.push(
                  entity === "companies"
                    ? `/tenants/${tenantKey}/architecture/company/${String(row.id)}`
                    : `/tenants/${tenantKey}/architecture/${entity}/${String(row.id)}`
                )
              }
              onDelete={openDelete}
            />
          ))}

          {/* Records created without a company — shown at the very top level. */}
          {rootNodes.length > 0 && (
            <div className="rounded-lg border border-dashed border-border">
              <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-warning-bg text-warning [&>svg]:h-4 [&>svg]:w-4">
                  <Unlink />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Not linked to a company</p>
                  <p className="text-[11px] uppercase tracking-wider text-foreground-muted">
                    {rootNodes.length} {rootNodes.length === 1 ? "record" : "records"} created without a company
                  </p>
                </div>
                <span className="ml-auto text-xs text-foreground-muted">Edit a record to attach it to a company.</span>
              </div>
              <div className="space-y-3 p-4">
                {rootNodes.map(({ entity, row }) => (
                  <OrgTreeNode
                    key={`${entity}:${String(row.id)}`}
                    entity={entity}
                    row={row}
                    depth={0}
                    path={{}}
                    tenantKey={tenantKey}
                    rows={rows}
                    ctx={ctx}
                    expanded={expanded}
                    onToggle={onToggle}
                    onAdd={openAdd}
                    onEdit={openEdit}
                    onView={(e, r) => router.push(`/tenants/${tenantKey}/architecture/${e}/${String(r.id)}`)}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCompanyAdd}>
              Add another company
            </Button>
            <span className="text-xs text-foreground-muted">
              {companies.length} {companies.length === 1 ? "company" : "companies"} in this tenant
            </span>
          </div>
        </div>
      )}

      {modal && (
        <OrgEntityFormModal
          open
          config={modal.config}
          allRows={rows}
          initial={modal.initial}
          defaults={modal.defaults}
          tenantKey={tenantKey}
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
        title={`Delete ${pendingDelete?.config.singular.toLowerCase()} "${pendingDelete ? rowLabel(pendingDelete.row) : ""}"?`}
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
    </div>
  );
}
