import type { SelectOption } from "@/types/ui";
import type { EmployeeStatus, EmployeeType, SecurityLevel } from "@/types/employees";

export const departmentOptions: SelectOption[] = [
  { label: "Engineering", value: "engineering" },
  { label: "Operations", value: "operations" },
  { label: "Production", value: "production" },
  { label: "Logistics", value: "logistics" },
  { label: "Security", value: "security" },
  { label: "Sales", value: "sales" },
  { label: "Human Resources", value: "hr" },
  { label: "Finance", value: "finance" },
  { label: "Marketing", value: "marketing" },
  { label: "Design", value: "design" },
  { label: "Support", value: "support" },
  { label: "Tech Ops", value: "tech-ops" },
  { label: "Manufacturing", value: "manufacturing" },
];

export const departmentLabels: Record<string, string> = Object.fromEntries(
  departmentOptions.map((o) => [String(o.value), o.label])
);

export const locationOptions: SelectOption[] = [
  { label: "Pune Plant", value: "pune-plant" },
  { label: "Pune Assembly Line", value: "pune-assembly" },
  { label: "Mumbai HQ", value: "mumbai-hq" },
  { label: "Mumbai Plant", value: "mumbai-plant" },
  { label: "Chennai Hub", value: "chennai-hub" },
  { label: "Chennai Warehouse", value: "chennai-warehouse" },
  { label: "Noida Plant", value: "noida-plant" },
  { label: "Delhi Office", value: "delhi-office" },
  { label: "Delhi Field Office", value: "delhi-field" },
  { label: "Kolkata HQ", value: "kolkata-hq" },
];

export const locationLabels: Record<string, string> = Object.fromEntries(
  locationOptions.map((o) => [String(o.value), o.label])
);

export const shiftOptions: SelectOption[] = [
  { label: "General Shift (09:00 AM - 05:30 PM)", value: "general" },
  { label: "Early Shift (06:00 AM - 02:00 PM)", value: "early" },
  { label: "Late Shift (02:00 PM - 10:00 PM)", value: "late" },
  { label: "Night Shift (10:00 PM - 06:00 AM)", value: "night" },
];

export const shiftLabels: Record<string, string> = Object.fromEntries(
  shiftOptions.map((o) => [String(o.value), o.label])
);

export const securityLevelOptions: SelectOption<SecurityLevel>[] = [
  { label: "Two-Factor (Face + Fingerprint)", value: "two-factor" },
  { label: "Face Only", value: "face" },
  { label: "Face + Employee PIN", value: "face-pin" },
];

export const securityLevelLabels: Record<SecurityLevel, string> = {
  "two-factor": "Two-Factor (Face + Fingerprint)",
  face: "Face Only",
  "face-pin": "Face + Employee PIN",
};

export const employeeTypeOptions: SelectOption<EmployeeType>[] = [
  { label: "Factory", value: "factory" },
  { label: "Field", value: "field" },
];

export const employeeTypeLabels: Record<EmployeeType, string> = {
  factory: "Factory",
  field: "Field",
};

export const employeeStatusOptions: SelectOption<EmployeeStatus>[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const employeeStatusLabels: Record<EmployeeStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
