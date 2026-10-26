import type { ReactNode } from "react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TruncateText } from "@/components/common/TruncateText";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { tenantStatusOptions, timezoneOptions } from "./tenant-options";
import type { OrgEntityKey, OrgGroupKey, OrgFormValues, OrgRow } from "@/types/organization";
import type { Status } from "@/types/common";
import type { SelectOption } from "@/types/ui";

/* -------------------------------------------------------------------------- */
/* Schema types — every `name`/`key` is the exact backend column name.        */
/* -------------------------------------------------------------------------- */

export type OrgFieldType = "text" | "select" | "number" | "date" | "textarea" | "boolean";

export interface OrgFieldDef {
  /** Exact DB column key — do not rename (keeps future API integration 1:1). */
  name: string;
  label: string;
  type: OrgFieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** Static dropdown options (used when `ref` is absent). */
  options?: SelectOption[];
  /** Reference column: rendered as a dropdown sourced from another entity's rows. */
  ref?: OrgEntityKey;
  refPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export interface OrgRenderCtx {
  /** Resolve a foreign key to `CODE · Name` using the loaded rows. Ids may be numeric or public_id strings. */
  label: (entity: OrgEntityKey, id: number | string | null | undefined) => string;
}

export interface OrgColumnDef {
  /** Exact DB column key. */
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  className?: string;
  render?: (row: OrgRow, ctx: OrgRenderCtx) => ReactNode;
}

export interface OrgEntityConfig {
  key: OrgEntityKey;
  /** Plural display label ("Companies"). */
  label: string;
  /** Singular label ("Company"). */
  singular: string;
  group: OrgGroupKey;
  description: string;
  columns: OrgColumnDef[];
  fields: OrgFieldDef[];
  /** Service-managed tables (closure tables) cannot be edited from the UI. */
  readOnly?: boolean;
  /** Optional cross-field validation (returns errors keyed by column name). */
  validate?: (values: OrgFormValues) => Partial<Record<string, string>>;
}

/* -------------------------------------------------------------------------- */
/* Cell helpers                                                               */
/* -------------------------------------------------------------------------- */

const EMPTY = "—";

const str = (v: unknown) => (v === null || v === undefined || v === "" ? EMPTY : String(v));
const cell = (key: string) => (row: OrgRow) => str(row[key]);
const dateCell = (key: string) => (row: OrgRow) => (row[key] ? formatDate(String(row[key])) : EMPTY);
const refCell =
  (key: string, entity: OrgEntityKey) =>
  (row: OrgRow, ctx: OrgRenderCtx) =>
    ctx.label(entity, row[key] as number | string);

/** Name cell: one line always — ellipsis on overflow, full value on hover. */
const nameCell = (key: string) => {
  function renderName(row: OrgRow) {
    const raw = row[key];
    return (
      <TruncateText
        title={raw === null || raw === undefined || raw === "" ? undefined : String(raw)}
        maxWidth="16rem"
        className="font-medium text-foreground"
      >
        {str(raw)}
      </TruncateText>
    );
  }
  return renderName;
};

const statusCell = (row: OrgRow) => <StatusBadge status={(row.status as Status) ?? "active"} variant="text" />;
const boolCell = (key: string) => {
  function renderBool(row: OrgRow): ReactNode {
    return row[key] ? (
      <Badge tone="success" variant="soft">Yes</Badge>
    ) : (
      <Badge tone="neutral" variant="soft">No</Badge>
    );
  }
  return renderBool;
};

/** Display one field value (ref → label, options → label, boolean → Yes/No …). */
export function orgDetailValue(field: OrgFieldDef, row: OrgRow, ctx: OrgRenderCtx): ReactNode {
  const raw = row[field.name];
  const blank = raw === null || raw === undefined || raw === "";

  if (field.type === "boolean" && !blank) {
    const yes = raw === true || raw === 1 || raw === "1";
    return yes ? <Badge tone="success" variant="soft">Yes</Badge> : <Badge tone="neutral" variant="soft">No</Badge>;
  }
  if (blank) return EMPTY;
  if (field.ref) {
    const n = Number(raw);
    // Ref ids may be numeric or public_id strings — pass non-numeric ones through.
    return ctx.label(field.ref, Number.isNaN(n) ? String(raw) : n);
  }
  if (field.options) {
    const opt = field.options.find((o) => String(o.value) === String(raw));
    if (opt) return opt.label;
  }
  if (field.type === "date") return formatDate(String(raw));
  return String(raw);
}

/* -------------------------------------------------------------------------- */
/* Dropdown option sets                                                       */
/* -------------------------------------------------------------------------- */

export const orgStatusOptions: SelectOption[] = [
  ...tenantStatusOptions,
  { label: "Pending", value: "pending" },
];

export const locationKindOptions: SelectOption[] = [
  { label: "Office", value: "office" },
  { label: "Plant", value: "plant" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Depot", value: "depot" },
  { label: "Campus", value: "campus" },
  { label: "Site", value: "site" },
];

export const zoneTypeOptions: SelectOption[] = [
  { label: "General", value: "general" },
  { label: "Restricted", value: "restricted" },
  { label: "Secure", value: "secure" },
  { label: "Sensitive", value: "sensitive" },
];

export const gateTypeOptions: SelectOption[] = [
  { label: "Entry", value: "entry" },
  { label: "Exit", value: "exit" },
  { label: "Bidirectional", value: "bidirectional" },
];

export const gateDirectionOptions: SelectOption[] = [
  { label: "In", value: "in" },
  { label: "Out", value: "out" },
  { label: "Both", value: "both" },
];

export const doorTypeOptions: SelectOption[] = [
  { label: "Normal", value: "normal" },
  { label: "Main", value: "main" },
  { label: "Fire Exit", value: "fire_exit" },
  { label: "Service", value: "service" },
];

export const doorFailModeOptions: SelectOption[] = [
  { label: "Fail Safe (unlocks on power loss)", value: "fail_safe" },
  { label: "Fail Secure (locks on power loss)", value: "fail_secure" },
];

export const booleanOptions: SelectOption[] = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

export const currencyOptions: SelectOption[] = [
  { label: "INR — Indian Rupee", value: "INR" },
  { label: "USD — US Dollar", value: "USD" },
  { label: "EUR — Euro", value: "EUR" },
  { label: "GBP — Pound Sterling", value: "GBP" },
  { label: "AED — UAE Dirham", value: "AED" },
];

export const countryCodeOptions: SelectOption[] = [
  { label: "IN — India", value: "IN" },
  { label: "US — United States", value: "US" },
  { label: "GB — United Kingdom", value: "GB" },
  { label: "AE — United Arab Emirates", value: "AE" },
  { label: "ZA — South Africa", value: "ZA" },
  { label: "SG — Singapore", value: "SG" },
  { label: "AU — Australia", value: "AU" },
];

export const fiscalMonthOptions: SelectOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: new Date(2024, i, 1).toLocaleString("en-US", { month: "long" }),
  value: String(i + 1),
}));

/* -------------------------------------------------------------------------- */
/* Section groups (left navigation)                                           */
/* -------------------------------------------------------------------------- */

export interface OrgGroup {
  key: OrgGroupKey;
  label: string;
  entities: OrgEntityKey[];
}

export const orgGroups: OrgGroup[] = [
  {
    key: "ownership",
    label: "Site ownership path",
    entities: ["companies", "legal_entities", "business_units", "plants", "branches", "locations"],
  },
  {
    key: "physical",
    label: "Physical containment",
    entities: ["buildings", "floors", "zones", "gates", "doors"],
  },
  {
    key: "org",
    label: "Functional organization",
    entities: ["departments", "department_hierarchy", "cost_centres"],
  },
  {
    key: "workforce",
    label: "Workforce catalogue",
    entities: ["grades", "designations"],
  },
];

/* -------------------------------------------------------------------------- */
/* Entity registry                                                            */
/* -------------------------------------------------------------------------- */

const commonMeta = {
  effective_from: { name: "effective_from", label: "Effective From", type: "date" as const },
  effective_to: {
    name: "effective_to",
    label: "Effective To",
    type: "date" as const,
    hint: "Leave empty for open-ended.",
  },
};

const statusField: OrgFieldDef = { name: "status", label: "Status", type: "select", required: true, options: orgStatusOptions };
const timezoneField: OrgFieldDef = { name: "timezone", label: "Timezone", type: "select", required: true, options: timezoneOptions };
const countryField: OrgFieldDef = { name: "country_code", label: "Country", type: "select", required: true, options: countryCodeOptions };

export const orgEntityConfigs: Record<OrgEntityKey, OrgEntityConfig> = {
  companies: {
    key: "companies",
    label: "Companies",
    singular: "Company",
    group: "ownership",
    description: "Operational company master inside a tenant; the reporting and ownership spine.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Company Name", sortable: true, render: nameCell("name") },
      { key: "legal_name", header: "Legal Name", render: cell("legal_name"), className: "text-foreground-secondary" },
      { key: "country_code", header: "Country", width: "90px", render: cell("country_code") },
      { key: "timezone", header: "Timezone", render: cell("timezone"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "code", label: "Company Code", type: "text", required: true, placeholder: "CMP-001" },
      { name: "name", label: "Display Name", type: "text", required: true, placeholder: "e.g. TrueFace Industries Pvt Ltd" },
      { name: "legal_name", label: "Legal Name", type: "text", placeholder: "Registered legal name" },
      { name: "trade_name", label: "Trade Name", type: "text", placeholder: "Trading / brand name" },
      { name: "slug", label: "Slug", type: "text", required: true, placeholder: "trueface-industries", hint: "Unique within the tenant." },
      { name: "email", label: "Contact Email", type: "text", placeholder: "corp@example.com" },
      { name: "phone", label: "Contact Phone", type: "text", placeholder: "+91 22 4000 1000" },
      { name: "website", label: "Website", type: "text", placeholder: "https://example.com" },
      timezoneField,
      { name: "default_currency", label: "Default Currency", type: "select", required: true, options: currencyOptions },
      countryField,
      { name: "fiscal_year_start_month", label: "Fiscal Year Start Month", type: "select", required: true, options: fiscalMonthOptions },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  legal_entities: {
    key: "legal_entities",
    label: "Legal Entities",
    singular: "Legal Entity",
    group: "ownership",
    description: "Registered legal bodies used for statutory, tax, payroll and contract identity.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "legal_name", header: "Legal Name", sortable: true, render: nameCell("legal_name") },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "registration_number", header: "Registration No.", render: cell("registration_number"), className: "text-foreground-secondary" },
      { key: "city", header: "City", render: cell("city") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Entity Code", type: "text", required: true, placeholder: "LE-001" },
      { name: "legal_name", label: "Legal Name", type: "text", required: true, placeholder: "Registered legal name" },
      { name: "registration_number", label: "Registration Number", type: "text", placeholder: "CIN / company registration" },
      { name: "tax_identifier", label: "Tax Identifier (GST/TIN)", type: "text", placeholder: "Tax registration number" },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address_line_1", label: "Address Line 1", type: "text", className: "sm:col-span-2" },
      { name: "address_line_2", label: "Address Line 2", type: "text", className: "sm:col-span-2" },
      { name: "city", label: "City", type: "text" },
      { name: "state_code", label: "State Code", type: "text", placeholder: "e.g. MH" },
      countryField,
      { name: "postal_code", label: "Postal Code", type: "text" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  business_units: {
    key: "business_units",
    label: "Business Units",
    singular: "Business Unit",
    group: "ownership",
    description: "Flexible commercial or operating hierarchy inside a company.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Business Unit", sortable: true, render: nameCell("name") },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "parent_business_unit_id", header: "Parent Unit", render: refCell("parent_business_unit_id", "business_units") },
      { key: "sort_order", header: "Order", width: "80px", render: cell("sort_order") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Unit Code", type: "text", required: true, placeholder: "BU-001" },
      { name: "name", label: "Unit Name", type: "text", required: true, placeholder: "e.g. Manufacturing Division" },
      {
        name: "parent_business_unit_id",
        label: "Parent Business Unit",
        type: "select",
        ref: "business_units",
        refPlaceholder: "None (top level)",
      },
      { name: "description", label: "Description", type: "textarea", className: "sm:col-span-2" },
      { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  plants: {
    key: "plants",
    label: "Plants",
    singular: "Plant",
    group: "ownership",
    description: "Manufacturing or industrial operating units.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Plant Name", sortable: true, render: nameCell("name") },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "legal_entity_id", header: "Legal Entity", render: refCell("legal_entity_id", "legal_entities") },
      { key: "business_unit_id", header: "Business Unit", render: refCell("business_unit_id", "business_units") },
      { key: "timezone", header: "Timezone", render: cell("timezone"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Plant Code", type: "text", required: true, placeholder: "PLZ-001" },
      { name: "name", label: "Plant Name", type: "text", required: true, placeholder: "e.g. Pune Assembly Plant" },
      { name: "legal_entity_id", label: "Legal Entity", type: "select", ref: "legal_entities", refPlaceholder: "None" },
      { name: "business_unit_id", label: "Business Unit", type: "select", ref: "business_units", refPlaceholder: "None" },
      timezoneField,
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  branches: {
    key: "branches",
    label: "Branches",
    singular: "Branch",
    group: "ownership",
    description: "Non-plant offices, depots, service centres or administrative branches.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Branch Name", sortable: true, render: nameCell("name") },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "legal_entity_id", header: "Legal Entity", render: refCell("legal_entity_id", "legal_entities") },
      { key: "business_unit_id", header: "Business Unit", render: refCell("business_unit_id", "business_units") },
      { key: "timezone", header: "Timezone", render: cell("timezone"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Branch Code", type: "text", required: true, placeholder: "BR-001" },
      { name: "name", label: "Branch Name", type: "text", required: true, placeholder: "e.g. Kolkata Head Office" },
      { name: "legal_entity_id", label: "Legal Entity", type: "select", ref: "legal_entities", refPlaceholder: "None" },
      { name: "business_unit_id", label: "Business Unit", type: "select", ref: "business_units", refPlaceholder: "None" },
      timezoneField,
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  locations: {
    key: "locations",
    label: "Locations",
    singular: "Location",
    group: "ownership",
    description: "Addressable sites where attendance, geofencing or access control can operate.",
    validate: (v) => {
      // Invariant: a location cannot belong to both a plant and a branch.
      if (v.plant_id && v.branch_id) {
        return { branch_id: "A location can belong to a plant OR a branch — never both." };
      }
      return {};
    },
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Location", sortable: true, render: nameCell("name") },
      { key: "location_kind", header: "Kind", width: "110px", render: cell("location_kind") },
      { key: "plant_id", header: "Plant", render: refCell("plant_id", "plants") },
      { key: "branch_id", header: "Branch", render: refCell("branch_id", "branches") },
      { key: "city", header: "City", render: cell("city") },
      { key: "attendance_enabled", header: "Attendance", width: "110px", render: boolCell("attendance_enabled") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Location Code", type: "text", required: true, placeholder: "LOC-001" },
      { name: "name", label: "Location Name", type: "text", required: true, placeholder: "e.g. Pune Plant Campus" },
      { name: "location_kind", label: "Location Kind", type: "select", required: true, options: locationKindOptions },
      { name: "business_unit_id", label: "Business Unit", type: "select", ref: "business_units", refPlaceholder: "None" },
      {
        name: "plant_id",
        label: "Owning Plant",
        type: "select",
        ref: "plants",
        refPlaceholder: "None",
        hint: "Pick a plant OR a branch — not both.",
      },
      {
        name: "branch_id",
        label: "Owning Branch",
        type: "select",
        ref: "branches",
        refPlaceholder: "None",
        hint: "Pick a plant OR a branch — not both.",
      },
      { name: "parent_location_id", label: "Parent Location", type: "select", ref: "locations", refPlaceholder: "None (top level)" },
      { name: "address_line_1", label: "Address Line 1", type: "text", className: "sm:col-span-2" },
      { name: "address_line_2", label: "Address Line 2", type: "text", className: "sm:col-span-2" },
      { name: "city", label: "City", type: "text" },
      { name: "state_code", label: "State Code", type: "text", placeholder: "e.g. MH" },
      countryField,
      { name: "postal_code", label: "Postal Code", type: "text" },
      { name: "latitude", label: "Latitude (WGS84)", type: "number", placeholder: "18.7606" },
      { name: "longitude", label: "Longitude (WGS84)", type: "number", placeholder: "73.8636" },
      { name: "default_geofence_radius_m", label: "Default Geofence Radius (m)", type: "number", placeholder: "500" },
      timezoneField,
      { name: "attendance_enabled", label: "Attendance Enabled", type: "boolean", options: booleanOptions },
      { name: "access_control_enabled", label: "Access Control Enabled", type: "boolean", options: booleanOptions },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  buildings: {
    key: "buildings",
    label: "Buildings",
    singular: "Building",
    group: "physical",
    description: "Named structures within a location.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Building", sortable: true, render: nameCell("name") },
      { key: "location_id", header: "Location", render: refCell("location_id", "locations") },
      { key: "description", header: "Description", render: cell("description"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "location_id", label: "Location", type: "select", required: true, ref: "locations", refPlaceholder: "Select location…" },
      { name: "code", label: "Building Code", type: "text", required: true, placeholder: "BLD-001" },
      { name: "name", label: "Building Name", type: "text", required: true, placeholder: "e.g. Assembly Block A" },
      { name: "description", label: "Description", type: "textarea", className: "sm:col-span-2" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  floors: {
    key: "floors",
    label: "Floors",
    singular: "Floor",
    group: "physical",
    description: "Ordered levels within a building, including negative basement levels.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Floor", sortable: true, render: nameCell("name") },
      { key: "building_id", header: "Building", render: refCell("building_id", "buildings") },
      { key: "location_id", header: "Location", render: refCell("location_id", "locations") },
      { key: "level_number", header: "Level", width: "80px", render: cell("level_number") },
      { key: "sort_order", header: "Order", width: "80px", render: cell("sort_order") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "location_id", label: "Location", type: "select", required: true, ref: "locations", refPlaceholder: "Select location…" },
      { name: "building_id", label: "Building", type: "select", required: true, ref: "buildings", refPlaceholder: "Select building…" },
      { name: "code", label: "Floor Code", type: "text", required: true, placeholder: "FLR-001" },
      { name: "name", label: "Floor Name", type: "text", required: true, placeholder: "e.g. Ground Floor" },
      { name: "level_number", label: "Level Number", type: "number", placeholder: "0", hint: "Negative values = basement levels." },
      { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
      statusField,
    ],
  },

  zones: {
    key: "zones",
    label: "Zones",
    singular: "Zone",
    group: "physical",
    description: "Logical or physical subdivisions used for restricted access and occupancy rules.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Zone", sortable: true, render: nameCell("name") },
      { key: "zone_type", header: "Type", width: "120px", render: cell("zone_type") },
      { key: "location_id", header: "Location", render: refCell("location_id", "locations") },
      { key: "building_id", header: "Building", render: refCell("building_id", "buildings") },
      { key: "is_restricted", header: "Restricted", width: "110px", render: boolCell("is_restricted") },
      { key: "capacity", header: "Capacity", width: "100px", render: cell("capacity") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "location_id", label: "Location", type: "select", required: true, ref: "locations", refPlaceholder: "Select location…" },
      { name: "code", label: "Zone Code", type: "text", required: true, placeholder: "ZN-001" },
      { name: "name", label: "Zone Name", type: "text", required: true, placeholder: "e.g. Assembly Line Zone" },
      { name: "zone_type", label: "Zone Type", type: "select", required: true, options: zoneTypeOptions },
      { name: "building_id", label: "Building", type: "select", ref: "buildings", refPlaceholder: "None (whole location)" },
      { name: "floor_id", label: "Floor", type: "select", ref: "floors", refPlaceholder: "None (whole building)" },
      { name: "parent_zone_id", label: "Parent Zone", type: "select", ref: "zones", refPlaceholder: "None (top level)" },
      { name: "is_restricted", label: "Restricted Zone", type: "boolean", options: booleanOptions },
      { name: "capacity", label: "Capacity", type: "number", placeholder: "100" },
      statusField,
    ],
  },

  departments: {
    key: "departments",
    label: "Departments",
    singular: "Department",
    group: "org",
    description: "Functional organization tree with optional plant, branch and location context.",
    columns: [
      { key: "code", header: "Code", width: "120px", sortable: true, render: cell("code") },
      { key: "name", header: "Department", sortable: true, render: nameCell("name") },
      { key: "parent_department_id", header: "Parent", render: refCell("parent_department_id", "departments") },
      { key: "plant_id", header: "Plant", render: refCell("plant_id", "plants") },
      { key: "branch_id", header: "Branch", render: refCell("branch_id", "branches") },
      { key: "location_id", header: "Location", render: refCell("location_id", "locations") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Department Code", type: "text", required: true, placeholder: "DEPT-001" },
      { name: "name", label: "Department Name", type: "text", required: true, placeholder: "e.g. Production" },
      {
        name: "parent_department_id",
        label: "Parent Department",
        type: "select",
        ref: "departments",
        refPlaceholder: "None (top level)",
      },
      { name: "business_unit_id", label: "Business Unit", type: "select", ref: "business_units", refPlaceholder: "None" },
      { name: "plant_id", label: "Plant", type: "select", ref: "plants", refPlaceholder: "None" },
      { name: "branch_id", label: "Branch", type: "select", ref: "branches", refPlaceholder: "None" },
      { name: "location_id", label: "Location", type: "select", ref: "locations", refPlaceholder: "None" },
      { name: "description", label: "Description", type: "textarea", className: "sm:col-span-2" },
      { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  department_hierarchy: {
    key: "department_hierarchy",
    label: "Dept. Hierarchy",
    singular: "Hierarchy Edge",
    group: "org",
    description:
      "Closure table making ancestor/descendant department queries fast and cycle-safe. Managed by the service — read only here.",
    readOnly: true,
    columns: [
      { key: "ancestor_department_id", header: "Ancestor Department", render: refCell("ancestor_department_id", "departments") },
      { key: "descendant_department_id", header: "Descendant Department", render: refCell("descendant_department_id", "departments") },
      { key: "depth", header: "Depth", width: "100px", render: (r) => <span className="tabular-nums">{str(r.depth)}</span> },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "ancestor_department_id", label: "Ancestor Department", type: "select", required: true, ref: "departments", refPlaceholder: "Select department…" },
      { name: "descendant_department_id", label: "Descendant Department", type: "select", required: true, ref: "departments", refPlaceholder: "Select department…" },
      { name: "depth", label: "Depth", type: "number", required: true, placeholder: "1", hint: "Self = 0, direct parent = 1." },
    ],
  },

  cost_centres: {
    key: "cost_centres",
    label: "Cost Centres",
    singular: "Cost Centre",
    group: "org",
    description: "Finance and payroll allocation codes attached to organization nodes.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Cost Centre", sortable: true, render: nameCell("name") },
      { key: "department_id", header: "Department", render: refCell("department_id", "departments") },
      { key: "plant_id", header: "Plant", render: refCell("plant_id", "plants") },
      { key: "branch_id", header: "Branch", render: refCell("branch_id", "branches") },
      { key: "external_payroll_code", header: "Payroll Code", render: cell("external_payroll_code"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Cost Centre Code", type: "text", required: true, placeholder: "CC-001" },
      { name: "name", label: "Cost Centre Name", type: "text", required: true, placeholder: "e.g. Manufacturing Cost Centre" },
      { name: "external_payroll_code", label: "External Payroll Code", type: "text", placeholder: "PAY-MFG-01" },
      { name: "legal_entity_id", label: "Legal Entity", type: "select", ref: "legal_entities", refPlaceholder: "None" },
      { name: "business_unit_id", label: "Business Unit", type: "select", ref: "business_units", refPlaceholder: "None" },
      { name: "plant_id", label: "Plant", type: "select", ref: "plants", refPlaceholder: "None" },
      { name: "branch_id", label: "Branch", type: "select", ref: "branches", refPlaceholder: "None" },
      { name: "location_id", label: "Location", type: "select", ref: "locations", refPlaceholder: "None" },
      { name: "department_id", label: "Department", type: "select", ref: "departments", refPlaceholder: "None" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  grades: {
    key: "grades",
    label: "Grades",
    singular: "Grade",
    group: "workforce",
    description: "Company-defined employee grade or band catalogue.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Grade", sortable: true, render: nameCell("name") },
      { key: "rank_order", header: "Rank", width: "90px", render: cell("rank_order") },
      { key: "description", header: "Description", render: cell("description"), className: "text-foreground-secondary" },
      { key: "status", header: "Status", width: "110px", render: statusCell },
      { key: "created_at", header: "Created", sortable: true, render: dateCell("created_at"), className: "text-foreground-secondary tabular-nums" },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Grade Code", type: "text", required: true, placeholder: "GR-001" },
      { name: "name", label: "Grade Name", type: "text", required: true, placeholder: "e.g. Executive Grade" },
      { name: "rank_order", label: "Rank Order", type: "number", required: true, placeholder: "1" },
      { name: "description", label: "Description", type: "textarea", className: "sm:col-span-2" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  designations: {
    key: "designations",
    label: "Designations",
    singular: "Designation",
    group: "workforce",
    description: "Company-defined job titles, optionally grouped by grade.",
    columns: [
      { key: "code", header: "Code", width: "120px", sortable: true, render: cell("code") },
      { key: "name", header: "Designation", sortable: true, render: nameCell("name") },
      { key: "grade_id", header: "Grade", render: refCell("grade_id", "grades") },
      { key: "company_id", header: "Company", render: refCell("company_id", "companies") },
      { key: "sort_order", header: "Order", width: "80px", render: cell("sort_order") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "code", label: "Designation Code", type: "text", required: true, placeholder: "DES-001" },
      { name: "name", label: "Designation Title", type: "text", required: true, placeholder: "e.g. Quality Engineer" },
      { name: "grade_id", label: "Grade", type: "select", ref: "grades", refPlaceholder: "None" },
      { name: "description", label: "Description", type: "textarea", className: "sm:col-span-2" },
      { name: "sort_order", label: "Sort Order", type: "number", placeholder: "0" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  gates: {
    key: "gates",
    label: "Gates",
    singular: "Gate",
    group: "physical",
    description: "Named entry, exit or bidirectional checkpoints at a location.",
    columns: [
      { key: "code", header: "Code", width: "120px", sortable: true, render: cell("code") },
      { key: "name", header: "Gate", sortable: true, render: nameCell("name") },
      { key: "gate_type", header: "Type", width: "130px", render: cell("gate_type") },
      { key: "direction", header: "Direction", width: "110px", render: cell("direction") },
      { key: "location_id", header: "Location", render: refCell("location_id", "locations") },
      { key: "zone_id", header: "Zone", render: refCell("zone_id", "zones") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "location_id", label: "Location", type: "select", required: true, ref: "locations", refPlaceholder: "Select location…" },
      { name: "code", label: "Gate Code", type: "text", required: true, placeholder: "GATE-001" },
      { name: "name", label: "Gate Name", type: "text", required: true, placeholder: "e.g. Main Entry Gate" },
      { name: "gate_type", label: "Gate Type", type: "select", required: true, options: gateTypeOptions },
      { name: "direction", label: "Direction", type: "select", required: true, options: gateDirectionOptions },
      { name: "zone_id", label: "Reference Zone", type: "select", ref: "zones", refPlaceholder: "None" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },

  doors: {
    key: "doors",
    label: "Doors",
    singular: "Door",
    group: "physical",
    description: "Physical controlled openings; device, relay and lock assignments come in later phases.",
    columns: [
      { key: "code", header: "Code", width: "110px", sortable: true, render: cell("code") },
      { key: "name", header: "Door", sortable: true, render: nameCell("name") },
      { key: "door_type", header: "Type", width: "120px", render: cell("door_type") },
      { key: "fail_mode", header: "Fail Mode", width: "130px", render: cell("fail_mode") },
      { key: "gate_id", header: "Gate", render: refCell("gate_id", "gates") },
      { key: "building_id", header: "Building", render: refCell("building_id", "buildings") },
      { key: "floor_id", header: "Floor", render: refCell("floor_id", "floors") },
      { key: "status", header: "Status", width: "110px", render: statusCell },
    ],
    fields: [
      { name: "company_id", label: "Company", type: "select", ref: "companies", refPlaceholder: "None (no company)" },
      { name: "location_id", label: "Location", type: "select", required: true, ref: "locations", refPlaceholder: "Select location…" },
      { name: "code", label: "Door Code", type: "text", required: true, placeholder: "DR-001" },
      { name: "name", label: "Door Name", type: "text", required: true, placeholder: "e.g. Server Room Door" },
      { name: "door_type", label: "Door Type", type: "select", required: true, options: doorTypeOptions },
      { name: "fail_mode", label: "Fail Mode", type: "select", required: true, options: doorFailModeOptions, hint: "Changes require privileged approval and an audit reason." },
      { name: "gate_id", label: "Gate", type: "select", ref: "gates", refPlaceholder: "None" },
      { name: "building_id", label: "Building", type: "select", ref: "buildings", refPlaceholder: "None" },
      { name: "floor_id", label: "Floor", type: "select", ref: "floors", refPlaceholder: "None" },
      { name: "zone_id", label: "Zone", type: "select", ref: "zones", refPlaceholder: "None" },
      statusField,
      commonMeta.effective_from,
      commonMeta.effective_to,
    ],
  },
};

export const orgEntityKeys = Object.keys(orgEntityConfigs) as OrgEntityKey[];

/* -------------------------------------------------------------------------- */
/* Structure tree (superadmin baseline setup)                                 */
/*                                                                            */
/* The model, in one glance:                                                  */
/*                                                                            */
/*   Company (required first)                                                 */
/*    ├── Legal Entity   · statutory identity → owns Plants, Branches         */
/*    ├── Business Unit  · commercial division → owns Plants, Branches,       */
/*    │                    Locations, Departments                              */
/*    ├── Plant / Branch · operating site → owns Locations, Departments       */
/*    ├── Location       · attendance site (geofence) → owns the full        */
/*    │                    physical chain: Building → Floor → Zone →          */
/*    │                    Gate → Door (devices mount on doors)               */
/*    ├── Department     · teams → owns Cost Centres                          */
/*    └── Grade          · employee bands → owns Designations                 */
/*                                                                            */
/* Consistency rules:                                                         */
/*  · Every operating node (Legal Entity, Business Unit, Plant, Branch)       */
/*    offers the SAME add-set: the children its schema FKs can actually       */
/*    attach to, plus the physical chain as a shortcut (the form asks for     */
/*    the Location and the record lands under it).                            */
/*  · A chip only appears where the record will really attach via a FK, so    */
/*    "add here → appears here" always holds.                                 */
/*                                                                            */
/* Rendered dynamically from config — labels, fields and add-forms all come   */
/* from orgEntityConfigs, so adding a key here is enough to extend the tree.  */
/* -------------------------------------------------------------------------- */

export const orgTreeChildren: Partial<Record<OrgEntityKey, OrgEntityKey[]>> = {
  companies: [
    "legal_entities",
    "business_units",
    "plants",
    "branches",
    "locations",
    "departments",
    "cost_centres",
    "grades",
    "designations",
    // Physical fallbacks: records added straight from a company (or without a
    // finer parent FK) still render somewhere — deepest attachment wins first.
    "buildings",
    "floors",
    "zones",
    "gates",
    "doors",
  ],
  // Statutory identity: owns the plants and branches registered under it.
  legal_entities: ["plants", "branches", "cost_centres", "buildings", "floors", "zones", "gates", "doors"],
  // Commercial division: same operating set as a legal entity, plus locations
  // and departments (both carry a business_unit_id FK).
  business_units: [
    "plants",
    "branches",
    "locations",
    "departments",
    "cost_centres",
    "buildings",
    "floors",
    "zones",
    "gates",
    "doors",
  ],
  // Operating sites (plant = industrial, branch = office/depot): both own
  // locations, departments and cost centres; physical chain via location.
  plants: ["locations", "departments", "cost_centres", "buildings", "floors", "zones", "gates", "doors"],
  branches: ["locations", "departments", "cost_centres", "buildings", "floors", "zones", "gates", "doors"],
  // The attendance anchor: geofence lives here, and so does the whole
  // physical containment chain devices plug into.
  locations: ["buildings", "floors", "zones", "gates", "doors", "departments"],
  buildings: ["floors"],
  floors: ["zones", "doors"],
  zones: ["gates", "doors"],
  gates: ["doors"],
  departments: ["cost_centres"],
  grades: ["designations"],
};

/**
 * Candidate parents per entity, most specific first. A row renders under the
 * first candidate whose FK is set AND whose entity lists this child in
 * orgTreeChildren, so each record appears exactly once even when it carries
 * several parent references (e.g. a location with both a company and a plant).
 */
export const orgTreeParents: Partial<Record<OrgEntityKey, OrgEntityKey[]>> = {
  legal_entities: ["companies"],
  business_units: ["companies"],
  plants: ["legal_entities", "business_units", "companies"],
  branches: ["legal_entities", "business_units", "companies"],
  locations: ["plants", "branches", "business_units", "companies"],
  buildings: ["locations", "companies"],
  floors: ["buildings", "locations", "companies"],
  zones: ["floors", "buildings", "locations", "companies"],
  gates: ["zones", "locations", "companies"],
  doors: ["gates", "zones", "floors", "buildings", "locations", "companies"],
  departments: ["plants", "branches", "business_units", "locations", "companies"],
  cost_centres: ["departments", "plants", "branches", "business_units", "legal_entities", "companies"],
  grades: ["companies"],
  designations: ["grades", "companies"],
};

/**
 * One-line guidance shown above the "Add under this …" chips on each tree
 * node, answering "what belongs here, and where do I add it?".
 */
export const orgTreeHints: Partial<Record<OrgEntityKey, string>> = {
  companies:
    "The client itself. Add legal entities, business units, plants, branches and locations under it.",
  legal_entities:
    "Statutory / tax identity of the company. Add the plants and branches it owns — their locations and buildings go under those.",
  business_units:
    "Commercial or operating division. Add its plants, branches, locations, departments — and the physical setup via a location.",
  plants:
    "Manufacturing or industrial site. Add its locations and departments here; buildings, floors and doors attach under a location.",
  branches:
    "Office, depot or service centre. Add its locations and departments here; buildings, floors and doors attach under a location.",
  locations:
    "Attendance site with geofence. Add buildings, floors, zones, gates, doors and site departments here — devices mount on doors.",
  buildings: "Structure inside a location. Add its floors here.",
  floors: "Level inside a building. Add its zones and doors here.",
  zones: "Subdivision for access rules. Add its gates and doors here.",
  gates: "Entry / exit checkpoint. Add the doors it controls here.",
  doors: "Controlled opening — this is where attendance devices are mounted.",
  departments: "Team or function. Add its cost centres here.",
  grades: "Employee grade or band. Add its designations here.",
};
