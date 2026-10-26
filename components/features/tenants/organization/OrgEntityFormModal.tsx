"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, fieldBase, fieldSizes } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField, FormActions } from "@/components/common/Form";
import { generatePublicId, nextOrgId } from "@/lib/mock-org-data";
import { ApiError } from "@/lib/api/errors";
import type { OrgEntityConfig, OrgFieldDef } from "@/config/organization";
import type { OrgFormValues, OrgRow, OrgRowsByEntity } from "@/types/organization";
import type { SelectOption } from "@/types/ui";

export interface OrgEntityFormModalProps {
  open: boolean;
  config: OrgEntityConfig;
  /** All loaded rows — reference fields render as dropdowns over these. */
  allRows: OrgRowsByEntity;
  /** Existing row when editing; null/undefined when creating. */
  initial?: OrgRow | null;
  /** Seed values on create (e.g. parent FKs prefilled from the tree node). */
  defaults?: OrgRow | null;
  /** Tenant public id (ULID) — used to seed local rows; the BFF resolves numeric tenant_id for API-backed entities. */
  tenantKey: string;
  /** Persist the record (may hit the API). Modal stays open on rejection. */
  onSave: (row: OrgRow) => Promise<void>;
  onClose: () => void;
}

/** Row value → form string ("", "1"/"0" for booleans, numbers stringified). */
function toFormValue(row: OrgRow | null | undefined, field: OrgFieldDef): string {
  const v = row?.[field.name];
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "1" : "0";
  return String(v);
}

function defaultsFor(config: OrgEntityConfig): OrgFormValues {
  const values: OrgFormValues = {};
  for (const f of config.fields) {
    if (f.name === "status") values[f.name] = "active";
    else if (f.name === "timezone") values[f.name] = "Asia/Kolkata";
    else if (f.name === "country_code") values[f.name] = "IN";
    else if (f.name === "fiscal_year_start_month") values[f.name] = "4";
    else if (f.type === "boolean") values[f.name] = "0";
    else values[f.name] = "";
  }
  return values;
}

function validateForm(config: OrgEntityConfig, values: OrgFormValues): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  for (const f of config.fields) {
    const v = values[f.name] ?? "";
    // A company is the mandatory root of the hierarchy: every org record must
    // belong to one (except the company table itself).
    const required = f.required || (f.ref === "companies" && config.key !== "companies");
    if (required && !v.trim()) {
      errors[f.name] = `${f.label} is required.`;
      continue;
    }
    if (v.trim() && f.type === "number" && Number.isNaN(Number(v))) {
      errors[f.name] = `${f.label} must be a number.`;
    }
  }
  return { ...errors, ...config.validate?.(values) };
}

/** Schema-driven add/edit form — dropdowns for every reference column. */
export function OrgEntityFormModal({ open, ...rest }: OrgEntityFormModalProps) {
  // Mount a fresh form per open/target so state initialises without effects.
  if (!open) return null;
  return (
    <OrgEntityFormInner
      key={`${rest.config.key}-${String(rest.initial?.id ?? "new")}-${rest.defaults ? Object.entries(rest.defaults).map(([k, v]) => `${k}=${String(v)}`).join("&") : "root"}`}
      {...rest}
    />
  );
}

function OrgEntityFormInner({ config, allRows, initial, defaults, tenantKey, onSave, onClose }: Omit<OrgEntityFormModalProps, "open">) {
  const editing = Boolean(initial);
  const [values, setValues] = React.useState<OrgFormValues>(() => {
    if (editing && initial) {
      return { ...defaultsFor(config), ...Object.fromEntries(config.fields.map((f) => [f.name, toFormValue(initial, f)])) };
    }
    const seeded = defaultsFor(config);
    if (defaults) {
      for (const f of config.fields) {
        const v = toFormValue(defaults, f);
        if (v !== "") seeded[f.name] = v;
      }
    }
    return seeded;
  });
  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const set = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const optionsFor = (field: OrgFieldDef): SelectOption[] => {
    if (field.ref) {
      let rows = allRows[field.ref] ?? [];
      // Scope cross-company references to the company this record belongs to,
      // so a form opened under "Rushi Corp" never offers "Khushi Corp" sites.
      const companyId = values.company_id;
      if (field.ref !== "companies" && companyId !== undefined && companyId !== null && companyId !== "") {
        rows = rows.filter(
          (r) => r.company_id === null || r.company_id === undefined || String(r.company_id) === String(companyId)
        );
      }
      // Then narrow by any parent FK already chosen on this form whose column
      // exists on the referenced rows — pick a Location and the Building /
      // Floor / Gate dropdowns only offer that location's records. Rows with
      // the column empty stay visible (same rule as the company filter).
      for (const f of config.fields) {
        if (f.name === field.name || !f.ref) continue;
        const v = values[f.name];
        if (v === undefined || v === null || v === "") continue;
        rows = rows.filter((r) => r[f.name] === null || r[f.name] === undefined || String(r[f.name]) === String(v));
      }
      const refs = rows.map((r) => ({
        label: `${String(r.code ?? "")} · ${String(r.name ?? r.legal_name ?? "")}`.replace(/ · $/, ""),
        value: String(r.id),
      }));
      return [{ label: field.refPlaceholder ?? "None", value: "" }, ...refs];
    }
    return field.options ?? [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(config, values);
    setErrors(errs);
    setFormError(null);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const isClosure = config.key === "department_hierarchy";
      const isApiBacked = config.key === "companies";
      // API-backed entities (companies): the server assigns id/public_id/
      // created_at and the BFF resolves tenant_id — only seed local identity.
      const base: OrgRow = initial
        ? { ...initial }
        : {
            ...(isApiBacked ? {} : { id: nextOrgId(allRows[config.key]) }),
            ...(isApiBacked ? {} : { tenant_id: tenantKey }),
            ...(isClosure || isApiBacked ? {} : { public_id: generatePublicId() }),
            ...(isApiBacked ? {} : { created_at: now }),
            ...(isClosure || isApiBacked ? {} : { settings: null, deleted_at: null }),
          };

      const record: OrgRow = { ...base };
      for (const f of config.fields) {
        const raw = values[f.name] ?? "";
        if (f.type === "boolean") record[f.name] = raw === "1";
        else if (f.type === "number") record[f.name] = raw.trim() === "" ? null : Number(raw);
        else record[f.name] = raw.trim() === "" ? null : raw.trim();
      }
      record.updated_at = now;
      await onSave(record);
    } catch (err) {
      // Backend validation errors (422) map onto the matching form fields.
      if (err instanceof ApiError && err.errors && Object.keys(err.errors).length > 0) {
        const fieldErrors: Partial<Record<string, string>> = {};
        for (const [field, messages] of Object.entries(err.errors)) {
          fieldErrors[field] = messages[0] ?? "Invalid value.";
        }
        setErrors(fieldErrors);
      }
      setFormError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderControl = (field: OrgFieldDef) => {
    const invalid = Boolean(errors[field.name]);
    const common = { id: field.name, invalid, disabled: field.disabled };

    if (field.type === "select" || field.type === "boolean") {
      return (
        <Select
          {...common}
          value={values[field.name] ?? ""}
          options={optionsFor(field)}
          onChange={(v) => set(field.name, String(v))}
        />
      );
    }
    if (field.type === "textarea") {
      return (
        <textarea
          id={field.name}
          aria-invalid={invalid || undefined}
          disabled={field.disabled}
          rows={3}
          value={values[field.name] ?? ""}
          onChange={(e) => set(field.name, e.target.value)}
          placeholder={field.placeholder}
          className={`${fieldBase} ${fieldSizes.md} py-2 resize-y`}
        />
      );
    }
    const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";
    return (
      <Input
        {...common}
        type={inputType}
        value={values[field.name] ?? ""}
        onChange={(e) => set(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={field.type === "number" || field.name.includes("code") ? "font-mono" : undefined}
        autoComplete="off"
      />
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="xl"
      title={`${editing ? "Edit" : "Add"} ${config.singular}`}
      description={config.description}
      footer={
        <FormActions>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="org-entity-form" variant="primary" loading={submitting}>
            {editing ? "Save Changes" : `Add ${config.singular}`}
          </Button>
        </FormActions>
      }
    >
      <form id="org-entity-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div
            role="alert"
            className="mb-5 rounded-md border border-danger bg-danger-bg px-3 py-2 text-sm text-danger"
          >
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <FormField
              key={field.name}
              label={field.label}
              htmlFor={field.name}
              required={field.required || (field.ref === "companies" && config.key !== "companies")}
              hint={field.hint}
              error={errors[field.name]}
              className={field.className}
            >
              {renderControl(field)}
            </FormField>
          ))}
        </div>
      </form>
    </Modal>
  );
}
