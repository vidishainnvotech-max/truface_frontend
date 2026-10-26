import * as React from "react";
import { ApiError } from "./errors";
import { apiTenantToTenant, tenantFormToApiPayload } from "./mappers";
import type { Tenant, TenantAdminFormValues, TenantFormValues } from "@/types/tenants";

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

export async function listTenants(): Promise<{ tenants: Tenant[]; total: number }> {
  const body = await request<{ data?: unknown; total?: number }>("/api/tenants");
  const rows = Array.isArray(body?.data) ? body.data : [];
  return {
    tenants: rows.map((row) => apiTenantToTenant(row)),
    total: typeof body?.total === "number" ? body.total : rows.length,
  };
}

export async function getTenant(id: string): Promise<Tenant> {
  const body = await request<{ data?: unknown }>("/api/tenants/" + encodeURIComponent(id));
  const raw = body?.data ?? body;
  if (!raw || typeof raw !== "object" || !("public_id" in raw || "id" in raw)) {
    throw new ApiError("Tenant not found.", 404);
  }
  return apiTenantToTenant(raw);
}

export async function createTenant(values: TenantFormValues, admin: TenantAdminFormValues): Promise<Tenant> {
  const body = await request<{ data?: unknown }>("/api/tenants", {
    method: "POST",
    body: JSON.stringify({ ...tenantFormToApiPayload(values), admin }),
  });
  return apiTenantToTenant(body?.data);
}

export async function updateTenant(id: string, values: TenantFormValues): Promise<Tenant> {
  const body = await request<{ data?: unknown }>("/api/tenants/" + encodeURIComponent(id), {
    method: "PUT",
    body: JSON.stringify(tenantFormToApiPayload(values)),
  });
  return apiTenantToTenant(body?.data);
}

export async function deleteTenant(id: string): Promise<void> {
  await request("/api/tenants/" + encodeURIComponent(id), { method: "DELETE" });
}

export interface UseTenantResult {
  tenant: Tenant | null;
  loading: boolean;
  notFound: boolean;
  error: string | null;
  reload: () => void;
}

interface TenantState {
  key: string;
  tenant: Tenant | null;
  notFound: boolean;
  error: string | null;
}

export function useTenant(id: string): UseTenantResult {
  const [state, setState] = React.useState<TenantState | null>(null);
  const [tick, setTick] = React.useState(0);
  const reload = React.useCallback(() => setTick((t) => t + 1), []);

  React.useEffect(() => {
    let cancelled = false;
    const key = `${id}#${tick}`;
    getTenant(id)
      .then((t) => {
        if (!cancelled) setState({ key, tenant: t, notFound: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const notFound = err instanceof ApiError && err.status === 404;
        const error = notFound ? null : err instanceof Error ? err.message : "Failed to load tenant.";
        setState({ key, tenant: null, notFound, error });
      });
    return () => {
      cancelled = true;
    };
  }, [id, tick]);

  const key = `${id}#${tick}`;
  const loading = state?.key !== key;
  return {
    tenant: loading ? null : state?.tenant ?? null,
    loading,
    notFound: !loading && (state?.notFound ?? false),
    error: loading ? null : state?.error ?? null,
    reload,
  };
}
