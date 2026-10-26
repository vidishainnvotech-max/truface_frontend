import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "sa_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export interface SessionUser {
  id?: number;
  name: string;
  email: string;
  role: string;
  username?: string;
  status?: string;
}

export interface Session {
  token: string;
  user: SessionUser;
}

export interface ApiBody {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
  meta?: { total?: number };
  [key: string]: unknown;
}

export function apiBaseUrl(): string {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL env var is not set");
  return base.replace(/\/+$/, "");
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed?.token && parsed?.user ? parsed : null;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: NextResponse, session: Session) {
  res.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function unauthorized(message = "Session expired. Please sign in again.") {
  const res = NextResponse.json({ success: false, message }, { status: 401 });
  clearSessionCookie(res);
  return res;
}

export interface UpstreamResult {
  status: number;
  ok: boolean;
  body: ApiBody | null;
  message: string;
  errors?: Record<string, string[]>;
  authFailure: boolean;
}

function asApiBody(value: unknown): ApiBody | null {
  return value && typeof value === "object" ? (value as ApiBody) : null;
}

/** Tolerant list normalizer: handles `{data: []}`, paginator `{data: [], meta}` and bare arrays. */
export function pickRows(body: ApiBody | null): unknown[] {
  if (Array.isArray(body)) return body as unknown[];
  if (!body || typeof body !== "object") return [];
  if (Array.isArray(body.data)) return body.data;
  const nested = asApiBody(body.data);
  if (Array.isArray(nested?.data)) return nested.data as unknown[];
  return [];
}

export function pickTotal(body: ApiBody | null, fallback: number): number {
  if (body && typeof body.meta?.total === "number") return body.meta.total;
  const nested = asApiBody(body?.data);
  if (nested && typeof nested.meta?.total === "number") return nested.meta.total;
  return fallback;
}

export function pickData(body: ApiBody | null): unknown {
  return body?.data ?? body;
}

export async function apiFetch(
  path: string,
  opts: { method?: string; token?: string | null; body?: unknown } = {}
): Promise<UpstreamResult> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(apiBaseUrl() + path, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("Unable to reach the API server.");
  }

  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text.slice(0, 300) };
    }
  }
  const body = asApiBody(parsed);

  const message = typeof body?.message === "string" ? body.message : res.ok ? "" : `Request failed (${res.status})`;
  const errors = body?.errors && typeof body.errors === "object" ? body.errors : undefined;
  const authFailure = res.status === 401 || (res.status === 500 && Boolean(opts.token) && message === "Server Error");

  return { status: res.status, ok: res.ok, body, message, errors, authFailure };
}

export function upstreamErrorResponse(up: UpstreamResult): NextResponse {
  if (up.authFailure) return unauthorized();
  const status = up.status >= 400 && up.status < 500 ? up.status : 502;
  return NextResponse.json({ success: false, message: up.message, errors: up.errors }, { status });
}

/**
 * Resolve a tenant's backend numeric id from its public id (ULID) by calling
 * GET /tenants/{public_id} upstream. Org entity APIs (companies, …) require
 * the numeric tenant_id — it must never be derived client-side.
 *
 * Returns null when the tenant cannot be resolved or the response omits the id.
 */
export async function resolveTenantNumericId(token: string, tenantPublicId: string): Promise<number | null> {
  let up: UpstreamResult;
  try {
    up = await apiFetch(`/tenants/${encodeURIComponent(tenantPublicId)}`, { token });
  } catch {
    return null;
  }
  if (!up.ok) return null;
  const data = (up.body?.data ?? up.body) as Record<string, unknown> | null;
  const id = data?.id;
  if (typeof id === "number" && Number.isFinite(id)) return id;
  return null;
}
