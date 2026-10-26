import { ApiError } from "./errors";
import { apiCompanyToOrgRow, companyRowToApiPayload } from "./mappers";
import type { OrgRow } from "@/types/organization";

interface ErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const errBody = (body ?? {}) as ErrorBody;
    throw new ApiError(errBody.message || `Request failed (${res.status})`, res.status, errBody.errors);
  }
  return body as T;
}

/**
 * List a tenant's companies. The BFF resolves the tenant's numeric backend id
 * from this public id (ULID) — the client never derives it.
 */
export async function listCompanies(tenantPublicId: string): Promise<OrgRow[]> {
  const body = await request<{ data?: unknown }>(
    "/api/companies?tenant_public_id=" + encodeURIComponent(tenantPublicId)
  );
  const rows = Array.isArray(body?.data) ? body.data : [];
  return rows.map((row) => apiCompanyToOrgRow(row));
}

/** Create a company; returns the server row (with id/public_id/created_at). */
export async function createCompany(tenantPublicId: string, row: OrgRow): Promise<OrgRow> {
  const body = await request<{ data?: unknown }>("/api/companies", {
    method: "POST",
    body: JSON.stringify({ ...companyRowToApiPayload(row), tenant_public_id: tenantPublicId }),
  });
  return apiCompanyToOrgRow(body?.data);
}

/** Update a company by public_id; returns the server row. */
export async function updateCompany(tenantPublicId: string, publicId: string, row: OrgRow): Promise<OrgRow> {
  const body = await request<{ data?: unknown }>("/api/companies/" + encodeURIComponent(publicId), {
    method: "PUT",
    body: JSON.stringify({ ...companyRowToApiPayload(row), tenant_public_id: tenantPublicId }),
  });
  return apiCompanyToOrgRow(body?.data);
}

/** Delete a company by public_id. */
export async function deleteCompany(publicId: string): Promise<void> {
  await request("/api/companies/" + encodeURIComponent(publicId), { method: "DELETE" });
}
