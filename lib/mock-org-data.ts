import type { OrgEntityKey, OrgRow, OrgRowsByEntity } from "@/types/organization";

/**
 * Organization tables are empty until the real API lands.
 *
 * TODO: replace `fetchOrgRows` with the real API call
 *       (`GET /api/tenants/{tenant}/organization/{entity}`).
 *       All fake seed rows (the demo company and its org tree) were removed —
 *       tenants now start with an empty structure the superadmin builds out.
 */

/** Empty catalogue — keys define the 16 entity tables the store loads. */
export const orgSeedData: OrgRowsByEntity = {
  companies: [],
  legal_entities: [],
  business_units: [],
  plants: [],
  branches: [],
  locations: [],
  buildings: [],
  floors: [],
  zones: [],
  departments: [],
  department_hierarchy: [],
  cost_centres: [],
  grades: [],
  designations: [],
  gates: [],
  doors: [],
};

/** Dummy fetch that mimics `GET /api/tenants/{tenant}/organization/{entity}`. */
export function fetchOrgRows(entity: OrgEntityKey, tenantId: number): Promise<OrgRow[]> {
  void entity;
  void tenantId;
  return Promise.resolve([]);
}

/** Derive the numeric tenant id (mock tenants use codes like "TF001"). */
export function tenantNumericId(tenantId: string): number {
  const digits = tenantId.replace(/\D/g, "");
  return digits ? Number(digits) : 1;
}

/** Next surrogate id for a locally added row (real ids come from the API). */
export function nextOrgId(rows: OrgRow[]): number {
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}

/** Stable ULID-shaped public id (26 chars) for locally added rows. */
export function generatePublicId(): string {
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let out = "01K";
  for (let i = 0; i < 23; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
