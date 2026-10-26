"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { ApiError } from "@/lib/api/errors";
import {
  TENANT_DOMAIN_SUFFIX,
  countryOptions,
  defaultTenantConfig,
  isolationOptions,
  localeOptions,
  regionOptions,
  tenantStatusOptions,
  timezoneOptions,
} from "@/config/tenant-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { FormField, FormActions } from "@/components/common/Form";
import type { Status } from "@/types/common";
import type { SelectOption } from "@/types/ui";
import type { IsolationMode, Tenant, TenantAdminFormValues, TenantFormValues } from "@/types/tenants";

export interface TenantFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<TenantFormValues>;
  onSubmit: (values: TenantFormValues, admin?: TenantAdminFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

const emptyValues: TenantFormValues = {
  code: "",
  name: "",
  slug: "",
  status: "active",
  isolation_mode: "shared",
  default_timezone: "Asia/Kolkata",
  default_locale: "en",
  country_code: "IN",
  data_residency_region: "india",
  settings: JSON.stringify(defaultTenantConfig, null, 2),
};

const emptyAdmin: TenantAdminFormValues = {
  username: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

type ErrorKey = keyof TenantFormValues | keyof TenantAdminFormValues | "admin_name" | "admin_email";
type Errors = Partial<Record<ErrorKey, string>>;

function validate(v: TenantFormValues, mode: "create" | "edit", admin: TenantAdminFormValues): Errors {
  const e: Errors = {};
  if (!v.code.trim()) e.code = "Tenant code is required.";
  else if (!/^[A-Z0-9_-]{3,12}$/i.test(v.code.trim())) e.code = "Use 3–12 letters, numbers, - or _.";
  if (!v.name.trim()) e.name = "Legal entity name is required.";
  if (!v.slug.trim()) e.slug = "Domain slug is required.";
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.slug.trim())) e.slug = "Lowercase letters, numbers and hyphens only.";
  if (mode === "create") {
    if (!admin.username.trim()) e.username = "Username is required.";
    else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(admin.username.trim())) e.username = "3–30 letters, numbers, . _ or -.";
    if (!admin.name.trim()) e.admin_name = "Administrator name is required.";
    if (!admin.email.trim()) e.admin_email = "Administrator email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(admin.email.trim())) e.admin_email = "Enter a valid email address.";
    if (!admin.password) e.password = "Password is required.";
    else if (admin.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (admin.password !== admin.password_confirmation) e.password_confirmation = "Passwords do not match.";
  }
  return e;
}

/** Map a Tenant entity to form values (used by the edit page). */
export function tenantToFormValues(t: Tenant): TenantFormValues {
  return {
    code: t.code,
    name: t.name,
    slug: t.slug,
    status: t.status,
    isolation_mode: t.isolation,
    default_timezone: t.timezone,
    default_locale: t.locale,
    country_code: t.countryCode,
    data_residency_region: t.region,
    settings: JSON.stringify(t.config ?? defaultTenantConfig, null, 2),
  };
}

/** Ensure the current value is always selectable, even if the API returned an unexpected option. */
function withValue<V extends string>(options: SelectOption<V>[], value: V): SelectOption<V>[] {
  if (!value || options.some((o) => o.value === value)) return options;
  return [...options, { label: value, value }];
}

export function TenantForm({ mode, initialValues, onSubmit, onCancel, submitLabel, submitting: submittingProp }: TenantFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = React.useState<TenantFormValues>({ ...emptyValues, ...initialValues });
  const [admin, setAdmin] = React.useState<TenantAdminFormValues>(emptyAdmin);
  const [errors, setErrors] = React.useState<Errors>({});
  const [internalSubmitting, setInternalSubmitting] = React.useState(false);
  const submitting = submittingProp ?? internalSubmitting;
  // Track whether the user has manually edited the slug so auto-hint stops overriding it.
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initialValues?.slug));
  const [usernameTouched, setUsernameTouched] = React.useState(false);

  const set = <K extends keyof TenantFormValues>(key: K, value: TenantFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setAdminField = <K extends keyof TenantAdminFormValues>(key: K, value: TenantAdminFormValues[K]) => {
    setAdmin((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onNameChange = (name: string) => {
    set("name", name);
    if (!slugTouched) set("slug", name ? slugify(name) : "");
    if (mode === "create" && !admin.name) setAdminField("name", name);
  };

  const onEmailChange = (email: string) => {
    setAdminField("email", email);
    if (mode === "create" && !usernameTouched) {
      const local = email.split("@")[0] ?? "";
      setAdminField("username", local ? slugify(local).replace(/-/g, ".") : "");
    }
  };

  const applyApiErrors = (err: unknown) => {
    if (!(err instanceof ApiError) || !err.errors) return;
    const mapped: Errors = {};
    for (const [key, messages] of Object.entries(err.errors)) {
      const alias = key === "admin.name" ? "admin_name" : key === "admin.email" ? "admin_email" : key.replace(/^admin\./, "");
      const clean = alias as ErrorKey;
      if (messages?.length) mapped[clean] = messages[0];
    }
    setErrors((prev) => ({ ...prev, ...mapped }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values, mode, admin);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setInternalSubmitting(true);
    try {
      const payload = { ...values, code: values.code.trim().toUpperCase(), name: values.name.trim(), slug: values.slug.trim() };
      await onSubmit(payload, mode === "create" ? { ...admin, name: admin.name.trim(), email: admin.email.trim(), username: admin.username.trim() } : undefined);
      toast.success(
        mode === "create"
          ? `Tenant "${payload.code}" created — now add the company that belongs to it`
          : `Tenant "${payload.code}" updated successfully`
      );
    } catch (err) {
      applyApiErrors(err);
      toast.error(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setInternalSubmitting(false);
    }
  };

  const cancel = onCancel ?? (() => router.back());

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="lg">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <FormField label="Tenant Code (Unique Key)" htmlFor="code" required error={errors.code}>
            <Input
              id="code"
              value={values.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="e.g. TF001"
              invalid={Boolean(errors.code)}
              disabled={mode === "edit" || submitting}
              autoComplete="off"
              className="font-mono uppercase"
            />
          </FormField>

          <FormField label="Tenant Legal Entity Name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Reliance Retail India"
              invalid={Boolean(errors.name)}
              disabled={submitting}
              autoComplete="organization"
            />
          </FormField>

          <FormField
            label="Domain Host Slug"
            htmlFor="slug"
            required
            error={errors.slug}
            hint={`Resolves to ${values.slug ? `${values.slug}.${TENANT_DOMAIN_SUFFIX}` : `your-slug.${TENANT_DOMAIN_SUFFIX}`}`}
          >
            <Input
              id="slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              placeholder="e.g. reliance-retail"
              invalid={Boolean(errors.slug)}
              disabled={submitting}
              className="font-mono text-foreground-secondary"
            />
          </FormField>

          <FormField label="Platform Initial Status" htmlFor="status">
            <Select<Status>
              id="status"
              value={values.status}
              options={withValue(tenantStatusOptions, values.status)}
              onChange={(v) => set("status", v)}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Data Isolation Mode" htmlFor="isolation_mode">
            <Select<IsolationMode>
              id="isolation_mode"
              value={values.isolation_mode}
              options={withValue(isolationOptions, values.isolation_mode)}
              onChange={(v) => set("isolation_mode", v)}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Default System Timezone" htmlFor="default_timezone">
            <Select
              id="default_timezone"
              value={values.default_timezone}
              options={withValue(timezoneOptions, values.default_timezone)}
              onChange={(v) => set("default_timezone", v)}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Default Locale" htmlFor="default_locale">
            <Select
              id="default_locale"
              value={values.default_locale}
              options={withValue(localeOptions, values.default_locale)}
              onChange={(v) => set("default_locale", v)}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Data Residency Region" htmlFor="data_residency_region">
            <Select
              id="data_residency_region"
              value={values.data_residency_region}
              options={withValue(regionOptions, values.data_residency_region)}
              onChange={(v) => set("data_residency_region", v)}
              disabled={submitting}
            />
          </FormField>

          <FormField label="Country" htmlFor="country_code">
            <Select
              id="country_code"
              value={values.country_code}
              options={withValue(countryOptions, values.country_code)}
              onChange={(v) => set("country_code", v)}
              disabled={submitting}
            />
          </FormField>
        </div>

        {mode === "create" && (
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Tenant Administrator</h3>
            <p className="mb-4 text-xs text-foreground-muted">
              This account becomes the admin login for the new tenant. The email is the sign-in identity.
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
              <FormField label="Admin Username" htmlFor="username" required error={errors.username}>
                <Input
                  id="username"
                  value={admin.username}
                  onChange={(e) => {
                    setUsernameTouched(true);
                    setAdminField("username", e.target.value);
                  }}
                  placeholder="e.g. admin.reliance"
                  invalid={Boolean(errors.username)}
                  disabled={submitting}
                  autoComplete="off"
                  className="font-mono"
                />
              </FormField>

              <FormField label="Admin Full Name" htmlFor="admin_name" required error={errors.admin_name}>
                <Input
                  id="admin_name"
                  value={admin.name}
                  onChange={(e) => setAdminField("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  disabled={submitting}
                  autoComplete="name"
                />
              </FormField>

              <FormField label="Admin Email (Login Identity)" htmlFor="admin_email" required error={errors.admin_email}>
                <Input
                  id="admin_email"
                  type="email"
                  value={admin.email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="admin@reliance.example.com"
                  invalid={Boolean(errors.admin_email)}
                  disabled={submitting}
                  autoComplete="off"
                />
              </FormField>

              <div />

              <FormField label="Admin Password" htmlFor="admin_password" required error={errors.password}>
                <Input
                  id="admin_password"
                  type="password"
                  value={admin.password}
                  onChange={(e) => setAdminField("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  invalid={Boolean(errors.password)}
                  disabled={submitting}
                  autoComplete="new-password"
                />
              </FormField>

              <FormField label="Confirm Password" htmlFor="admin_password_confirmation" required error={errors.password_confirmation}>
                <Input
                  id="admin_password_confirmation"
                  type="password"
                  value={admin.password_confirmation}
                  onChange={(e) => setAdminField("password_confirmation", e.target.value)}
                  placeholder="Re-enter password"
                  invalid={Boolean(errors.password_confirmation)}
                  disabled={submitting}
                  autoComplete="new-password"
                />
              </FormField>
            </div>
          </div>
        )}

        <FormActions className="mt-8">
          <Button type="button" variant="ghost" onClick={cancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {submitLabel ?? (mode === "create" ? "Create Tenant" : "Save Changes")}
          </Button>
        </FormActions>
      </Card>
    </form>
  );
}
