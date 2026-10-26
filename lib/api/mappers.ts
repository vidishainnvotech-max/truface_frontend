import { TENANT_DOMAIN_SUFFIX, countryNames } from "@/config/tenant-options";
import type { IsolationMode, Tenant, TenantFormValues } from "@/types/tenants";
import type { Status } from "@/types/common";
import type { OrgRow } from "@/types/organization";

const KNOWN_ISOLATION: IsolationMode[] = ["shared", "dedicated", "shared-cluster", "dedicated-db", "dedicated-cluster"];
const KNOWN_STATUS: Status[] = ["active", "inactive", "suspended"];

export function apiTenantToTenant(raw: unknown): Tenant {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, d = ""): string => (typeof v === "string" ? v : d);
  const slug = str(r.slug);
  const countryCode = str(r.country_code);
  const settings = r.settings;
  return {
    id: str(r.public_id) || str(r.id),
    numericId: typeof r.id === "number" && Number.isFinite(r.id) ? r.id : null,
    code: str(r.code),
    name: str(r.name),
    slug,
    domainSlug: slug ? `${slug}.${TENANT_DOMAIN_SUFFIX}` : "",
    status: typeof r.status === "string" && (KNOWN_STATUS as string[]).includes(r.status) ? (r.status as Status) : "active",
    isolation:
      typeof r.isolation_mode === "string" && (KNOWN_ISOLATION as string[]).includes(r.isolation_mode)
        ? (r.isolation_mode as IsolationMode)
        : "shared",
    timezone: str(r.default_timezone, "Asia/Kolkata"),
    locale: str(r.default_locale, "en"),
    region: str(r.data_residency_region),
    country: countryNames[countryCode] ?? countryCode,
    countryCode,
    plan: "—",
    users: 0,
    devices: 0,
    createdAt: str(r.created_at),
    config: settings && typeof settings === "object" && !Array.isArray(settings) ? (settings as Record<string, unknown>) : undefined,
  };
}

export function tenantFormToApiPayload(values: TenantFormValues): Record<string, unknown> {
  let settings: Record<string, unknown> = {};
  if (values.settings.trim()) {
    try {
      const parsed = JSON.parse(values.settings);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) settings = parsed;
    } catch {
      settings = {};
    }
  }
  return {
    code: values.code.trim().toUpperCase(),
    name: values.name.trim(),
    slug: values.slug.trim(),
    status: values.status,
    isolation_mode: values.isolation_mode,
    default_timezone: values.default_timezone,
    default_locale: values.default_locale,
    country_code: values.country_code,
    data_residency_region: values.data_residency_region,
    settings,
  };
}

/* -------------------------------------------------------------------------- */
/* Companies — org entity backed by POST/PUT /companies.                       */
/* -------------------------------------------------------------------------- */

/** Backend company row → generic OrgRow (snake_case passes through 1:1).
 * When the backend omits the numeric id, fall back to public_id so row.id
 * is always a usable identity for tree keys and upsert matching. */
export function apiCompanyToOrgRow(raw: unknown): OrgRow {
  const r = (raw && typeof raw === "object" ? raw : {}) as OrgRow;
  if (r.id === undefined || r.id === null || r.id === "") {
    return { ...r, id: r.public_id ?? "" };
  }
  return r;
}

/**
 * Modal-built company OrgRow → POST/PUT /companies payload.
 * Empty optional values become null; fiscal month is numeric; settings is an
 * object. tenant_id is NOT included — the BFF resolves the tenant's numeric
 * id server-side from tenant_public_id.
 */
export function companyRowToApiPayload(row: OrgRow): Record<string, unknown> {
  const text = (key: string): string | null => {
    const v = row[key];
    if (v === null || v === undefined || v === "") return null;
    return String(v);
  };
  const fiscal = Number(row.fiscal_year_start_month ?? 1);
  return {
    code: text("code"),
    name: text("name"),
    legal_name: text("legal_name"),
    trade_name: text("trade_name"),
    slug: text("slug"),
    email: text("email"),
    phone: text("phone"),
    website: text("website"),
    timezone: text("timezone"),
    default_currency: text("default_currency"),
    country_code: text("country_code"),
    fiscal_year_start_month: Number.isFinite(fiscal) && fiscal > 0 ? fiscal : 1,
    status: text("status") ?? "active",
    settings: {},
    effective_from: text("effective_from"),
  };
}
