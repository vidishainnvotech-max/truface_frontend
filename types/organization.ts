import type { Status } from "./common";

/**
 * Phase 2 · Organization foundation tables.
 *
 * Every key below mirrors the backend column name 1:1 (snake_case, exactly as in
 * the MySQL schema) so the dummy data can be swapped for real API payloads
 * without any mapping layer.
 */
export type OrgEntityKey =
  | "companies"
  | "legal_entities"
  | "business_units"
  | "plants"
  | "branches"
  | "locations"
  | "buildings"
  | "floors"
  | "zones"
  | "departments"
  | "department_hierarchy"
  | "cost_centres"
  | "grades"
  | "designations"
  | "gates"
  | "doors";

export type OrgGroupKey = "ownership" | "physical" | "org" | "workforce";

/** Loose row shape used by the generic architecture table/form (schema-driven). */
export type OrgRow = Record<string, unknown>;

export type OrgRowsByEntity = Record<OrgEntityKey, OrgRow[]>;

/** Form payload keyed by the exact DB column names. */
export type OrgFormValues = Record<string, string>;

/* -------------------------------------------------------------------------- */
/* TABLE 02 · companies — operational company master inside a tenant.          */
/* -------------------------------------------------------------------------- */
export type Company = {
  id: number;
  tenant_id: number;
  public_id: string;
  code: string;
  name: string;
  legal_name: string | null;
  trade_name: string | null;
  slug: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  timezone: string;
  default_currency: string;
  country_code: string;
  fiscal_year_start_month: number;
  status: Status;
  settings: Record<string, unknown> | null;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 03 · legal_entities — registered legal bodies (statutory/tax/payroll). */
/* -------------------------------------------------------------------------- */
export type LegalEntity = {
  id: number;
  tenant_id: number;
  company_id: number;
  public_id: string;
  code: string;
  legal_name: string;
  registration_number: string | null;
  tax_identifier: string | null;
  email: string | null;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_code: string | null;
  country_code: string;
  postal_code: string | null;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 04 · business_units — commercial/operating hierarchy inside company.  */
/* -------------------------------------------------------------------------- */
export type BusinessUnit = {
  id: number;
  tenant_id: number;
  company_id: number;
  parent_business_unit_id: number | null;
  public_id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 05 · plants — manufacturing / industrial operating units.             */
/* -------------------------------------------------------------------------- */
export type Plant = {
  id: number;
  tenant_id: number;
  company_id: number;
  legal_entity_id: number | null;
  business_unit_id: number | null;
  public_id: string;
  code: string;
  name: string;
  timezone: string;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 06 · branches — non-plant offices, depots, service centres.           */
/* -------------------------------------------------------------------------- */
export type Branch = {
  id: number;
  tenant_id: number;
  company_id: number;
  legal_entity_id: number | null;
  business_unit_id: number | null;
  public_id: string;
  code: string;
  name: string;
  timezone: string;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 07 · locations — addressable sites (attendance/geofencing/access).    */
/* -------------------------------------------------------------------------- */
export type LocationKind = "office" | "plant" | "warehouse" | "depot" | "campus" | "site";

export type Location = {
  id: number;
  tenant_id: number;
  company_id: number;
  business_unit_id: number | null;
  /** A location belongs to a plant OR a branch (never both). */
  plant_id: number | null;
  branch_id: number | null;
  parent_location_id: number | null;
  public_id: string;
  code: string;
  name: string;
  location_kind: LocationKind;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_code: string | null;
  country_code: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  default_geofence_radius_m: number | null;
  timezone: string;
  attendance_enabled: boolean;
  access_control_enabled: boolean;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 08 · buildings — named structures within a location.                  */
/* -------------------------------------------------------------------------- */
export type Building = {
  id: number;
  tenant_id: number;
  company_id: number;
  location_id: number;
  public_id: string;
  code: string;
  name: string;
  description: string | null;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 09 · floors — ordered levels (negative level numbers = basements).    */
/* -------------------------------------------------------------------------- */
export type Floor = {
  id: number;
  tenant_id: number;
  company_id: number;
  location_id: number;
  building_id: number;
  public_id: string;
  code: string;
  name: string;
  level_number: number | null;
  sort_order: number;
  status: Status;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 10 · zones — logical/physical subdivisions (access + occupancy).      */
/* -------------------------------------------------------------------------- */
export type ZoneType = "general" | "restricted" | "secure" | "sensitive";

export type Zone = {
  id: number;
  tenant_id: number;
  company_id: number;
  location_id: number;
  building_id: number | null;
  floor_id: number | null;
  parent_zone_id: number | null;
  public_id: string;
  code: string;
  name: string;
  zone_type: ZoneType;
  is_restricted: boolean;
  capacity: number | null;
  status: Status;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 11 · departments — functional organization tree.                      */
/* -------------------------------------------------------------------------- */
export type Department = {
  id: number;
  tenant_id: number;
  company_id: number;
  business_unit_id: number | null;
  plant_id: number | null;
  branch_id: number | null;
  location_id: number | null;
  parent_department_id: number | null;
  public_id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 12 · department_hierarchy — closure table (service-managed).          */
/* -------------------------------------------------------------------------- */
export type DepartmentHierarchy = {
  id: number;
  tenant_id: number;
  company_id: number;
  ancestor_department_id: number;
  descendant_department_id: number;
  depth: number;
  created_at: string;
  updated_at: string;
};

/* -------------------------------------------------------------------------- */
/* TABLE 13 · cost_centres — finance / payroll allocation codes.               */
/* -------------------------------------------------------------------------- */
export type CostCentre = {
  id: number;
  tenant_id: number;
  company_id: number;
  legal_entity_id: number | null;
  business_unit_id: number | null;
  plant_id: number | null;
  branch_id: number | null;
  location_id: number | null;
  department_id: number | null;
  public_id: string;
  code: string;
  name: string;
  external_payroll_code: string | null;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 14 · grades — company-defined employee grade / band catalogue.        */
/* -------------------------------------------------------------------------- */
export type Grade = {
  id: number;
  tenant_id: number;
  company_id: number;
  public_id: string;
  code: string;
  name: string;
  rank_order: number;
  description: string | null;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 15 · designations — job titles, optionally grouped by grade.          */
/* -------------------------------------------------------------------------- */
export type Designation = {
  id: number;
  tenant_id: number;
  company_id: number;
  grade_id: number | null;
  public_id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 16 · gates — entry/exit/bidirectional checkpoints at a location.      */
/* -------------------------------------------------------------------------- */
export type GateType = "entry" | "exit" | "bidirectional";
export type GateDirection = "in" | "out" | "both";

export type Gate = {
  id: number;
  tenant_id: number;
  company_id: number;
  location_id: number;
  zone_id: number | null;
  public_id: string;
  code: string;
  name: string;
  gate_type: GateType;
  direction: GateDirection;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/* -------------------------------------------------------------------------- */
/* TABLE 17 · doors — physical controlled openings (devices added later).      */
/* -------------------------------------------------------------------------- */
export type DoorType = "normal" | "main" | "fire_exit" | "service";
export type DoorFailMode = "fail_safe" | "fail_secure";

export type Door = {
  id: number;
  tenant_id: number;
  company_id: number;
  location_id: number;
  gate_id: number | null;
  building_id: number | null;
  floor_id: number | null;
  zone_id: number | null;
  public_id: string;
  code: string;
  name: string;
  door_type: DoorType;
  fail_mode: DoorFailMode;
  status: Status;
  effective_from: string | null;
  effective_to: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/** Entity key → concrete row type (used by mocks and future API services). */
export interface OrgRecordMap {
  companies: Company;
  legal_entities: LegalEntity;
  business_units: BusinessUnit;
  plants: Plant;
  branches: Branch;
  locations: Location;
  buildings: Building;
  floors: Floor;
  zones: Zone;
  departments: Department;
  department_hierarchy: DepartmentHierarchy;
  cost_centres: CostCentre;
  grades: Grade;
  designations: Designation;
  gates: Gate;
  doors: Door;
}
