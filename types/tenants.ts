import type { Status } from "./common";

export type IsolationMode = "shared" | "dedicated" | "shared-cluster" | "dedicated-db" | "dedicated-cluster";

export interface Tenant {
  id: string;
  /** Backend numeric tenant id — required by org entity APIs (e.g. companies.tenant_id). */
  numericId: number | null;
  code: string;
  name: string;
  slug: string;
  domainSlug: string;
  status: Status;
  isolation: IsolationMode;
  timezone: string;
  locale: string;
  region: string;
  country: string;
  countryCode: string;
  plan: string;
  users: number;
  devices: number;
  createdAt: string;
  config?: Record<string, unknown>;
}

export interface TenantFormValues {
  code: string;
  name: string;
  slug: string;
  status: Status;
  isolation_mode: IsolationMode;
  default_timezone: string;
  default_locale: string;
  country_code: string;
  data_residency_region: string;
  settings: string;
}

export interface TenantAdminFormValues {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  timestamp: string;
  status: "success" | "failed";
}
