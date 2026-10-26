"use client";

import * as React from "react";
import { fetchOrgRows, orgSeedData } from "@/lib/mock-org-data";
import { createCompany, deleteCompany, listCompanies, updateCompany } from "@/lib/api/companies";
import { orgEntityConfigs } from "@/config/organization";
import type { OrgEntityKey, OrgRow, OrgRowsByEntity } from "@/types/organization";
import type { OrgRenderCtx } from "@/config/organization";

/**
 * Client-side store for organization rows, shared by the architecture page
 * and the per-record detail pages (both live in different routes, so local
 * component state would be lost on navigation).
 *
 * Companies are backed by the real API (GET/POST/PUT/DELETE /companies);
 * the remaining entity tables still use the local in-memory store until
 * their endpoints land.
 */

const entityKeys = Object.keys(orgSeedData) as OrgEntityKey[];

const emptyRows = (): OrgRowsByEntity =>
  Object.fromEntries(entityKeys.map((k) => [k, []])) as unknown as OrgRowsByEntity;

/** Stable placeholder so not-ready renders don't churn identities. */
const EMPTY_ROWS = emptyRows();

export interface OrgStoreSnapshot {
  /** Tenant public id (ULID) — the org rows are scoped to this tenant. */
  tenantKey: string | null;
  rows: OrgRowsByEntity | null;
}

const INITIAL: OrgStoreSnapshot = { tenantKey: null, rows: null };

let state: OrgStoreSnapshot = INITIAL;
const listeners = new Set<() => void>();
let seq = 0;
let inflight: Promise<void> | null = null;
let inflightTenant: string | null = null;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeOrgStore(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getOrgStoreSnapshot(): OrgStoreSnapshot {
  return state;
}

const getServerOrgSnapshot = () => INITIAL;

/** Load all 16 entity tables for a tenant once (idempotent, race-guarded). */
export function ensureOrgRows(tenantKey: string): Promise<void> {
  if (state.tenantKey === tenantKey && state.rows) return Promise.resolve();
  if (inflight && inflightTenant === tenantKey) return inflight;

  const mySeq = ++seq;
  const next = Promise.all(
    entityKeys.map((k) =>
      k === "companies"
        ? listCompanies(tenantKey).catch((err) => {
            console.error("Failed to load companies:", err);
            return [] as OrgRow[];
          })
        : fetchOrgRows(k, 0)
    )
  )
    .then((results) => {
      if (mySeq !== seq) return;
      state = {
        tenantKey,
        rows: Object.fromEntries(entityKeys.map((k, i) => [k, results[i]])) as OrgRowsByEntity,
      };
      emit();
    })
    .finally(() => {
      if (mySeq === seq) {
        inflight = null;
        inflightTenant = null;
      }
    });

  inflight = next;
  inflightTenant = tenantKey;
  return next;
}

export function upsertOrgRow(entity: OrgEntityKey, row: OrgRow): void {
  if (!state.rows) return;
  const list = state.rows[entity];
  const sid = String(row.id);
  const exists = list.some((r) => String(r.id) === sid);
  state = {
    ...state,
    rows: {
      ...state.rows,
      [entity]: exists ? list.map((r) => (String(r.id) === sid ? row : r)) : [...list, row],
    },
  };
  emit();
}

export function removeOrgRow(entity: OrgEntityKey, id: unknown): void {
  if (!state.rows) return;
  const sid = String(id);
  state = {
    ...state,
    rows: { ...state.rows, [entity]: state.rows[entity].filter((r) => String(r.id) !== sid) },
  };
  emit();
}

/**
 * Persist an org row. Companies go through the real API (POST create /
 * PUT by public_id); other entities stay on the local store.
 * `tenantKey` is the tenant public id — the BFF resolves the numeric backend
 * tenant_id server-side. Returns the saved row (server row for companies).
 */
export async function saveOrgRow(entity: OrgEntityKey, row: OrgRow, tenantKey: string): Promise<OrgRow> {
  if (entity === "companies") {
    const publicId = row.public_id ? String(row.public_id) : "";
    const saved = publicId
      ? await updateCompany(tenantKey, publicId, row)
      : await createCompany(tenantKey, row);
    upsertOrgRow(entity, saved);
    return saved;
  }
  upsertOrgRow(entity, row);
  return row;
}

/** Delete an org row. Companies call DELETE /companies/{public_id}; others are local. */
export async function deleteOrgRow(entity: OrgEntityKey, row: OrgRow): Promise<void> {
  if (entity === "companies" && row.public_id) {
    await deleteCompany(String(row.public_id));
  }
  removeOrgRow(entity, row.id);
}

/**
 * Count records in other entity tables that still reference this row through
 * any FK column (ref field). Used to block deleting a parent while children
 * exist — e.g. a location that still has buildings, or a company with sites.
 */
export function countOrgChildren(rows: OrgRowsByEntity, entity: OrgEntityKey, id: unknown): number {
  if (id === null || id === undefined) return 0;
  const sid = String(id);
  let count = 0;
  for (const key of Object.keys(orgEntityConfigs) as OrgEntityKey[]) {
    if (key === entity) continue;
    const refFields = orgEntityConfigs[key].fields.filter((f) => f.ref === entity);
    if (refFields.length === 0) continue;
    for (const row of rows[key]) {
      if (row.deleted_at) continue;
      const linked = refFields.some((f) => {
        const v = row[f.name];
        return v !== null && v !== undefined && v !== "" && String(v) === sid;
      });
      if (linked) count++;
    }
  }
  return count;
}

/** Subscribe a component to the store and kick off loading for the tenant. */
export function useOrgStore(tenantKey: string): { rows: OrgRowsByEntity; loading: boolean } {
  const snapshot = React.useSyncExternalStore(subscribeOrgStore, getOrgStoreSnapshot, getServerOrgSnapshot);

  React.useEffect(() => {
    void ensureOrgRows(tenantKey);
  }, [tenantKey]);

  const ready = Boolean(snapshot.rows && snapshot.tenantKey === tenantKey);
  return { rows: ready ? (snapshot.rows as OrgRowsByEntity) : EMPTY_ROWS, loading: !ready };
}

/** Resolve foreign keys to `CODE · Name` using a rows snapshot. */
export function createOrgRenderCtx(rows: OrgRowsByEntity): OrgRenderCtx {
  return {
    label: (entity, id) => {
      if (id === null || id === undefined) return "—";
      const sid = String(id);
      const row = rows[entity].find((r) => String(r.id) === sid);
      if (!row) return `#${sid}`;
      const name = row.name ?? row.legal_name ?? "";
      return `${String(row.code ?? "")} · ${String(name)}`.replace(/ · $/, "");
    },
  };
}
