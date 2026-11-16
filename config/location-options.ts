import type { SelectOption } from "@/types/ui";
import type { LocationStatus, LocationType } from "@/types/locations";

export const locationTypeOptions: SelectOption<LocationType>[] = [
  { label: "Factory Node", value: "factory-node" },
  { label: "Corporate HQ", value: "corporate-hq" },
  { label: "Distribution", value: "distribution" },
  { label: "Field Office", value: "field-office" },
  { label: "R&D Center", value: "rnd-center" },
  { label: "Warehouse", value: "warehouse" },
];

/** Select-friendly labels used by the add/edit form (Factory, Warehouse…). */
export const locationFormTypeOptions: SelectOption<LocationType>[] = [
  { label: "Factory", value: "factory-node" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Corporate Office", value: "corporate-hq" },
  { label: "Distribution", value: "distribution" },
  { label: "Field Office", value: "field-office" },
  { label: "R&D Center", value: "rnd-center" },
];

export const locationTypeLabels: Record<LocationType, string> = Object.fromEntries(
  locationTypeOptions.map((o) => [String(o.value), o.label])
) as Record<LocationType, string>;

export const locationStatusOptions: SelectOption<LocationStatus>[] = [
  { label: "Active Only", value: "active" },
  { label: "Inactive Only", value: "inactive" },
];

export const locationStatusLabels: Record<LocationStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const locationStateOptions: SelectOption[] = [
  { label: "Uttar Pradesh", value: "up" },
  { label: "Maharashtra", value: "mh" },
  { label: "Tamil Nadu", value: "tn" },
  { label: "Karnataka", value: "ka" },
  { label: "Delhi", value: "dl" },
  { label: "Gujarat", value: "gj" },
  { label: "West Bengal", value: "wb" },
  { label: "Rajasthan", value: "rj" },
];

export const locationStateLabels: Record<string, string> = Object.fromEntries(
  locationStateOptions.map((o) => [String(o.value), o.label])
);

export const locationTimeOptions: SelectOption[] = [
  { label: "06:00 AM", value: "06:00 AM" },
  { label: "07:00 AM", value: "07:00 AM" },
  { label: "08:00 AM", value: "08:00 AM" },
  { label: "09:00 AM", value: "09:00 AM" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "06:00 PM", value: "06:00 PM" },
  { label: "07:00 PM", value: "07:00 PM" },
  { label: "08:00 PM", value: "08:00 PM" },
  { label: "09:00 PM", value: "09:00 PM" },
];

export const locationTimezoneOptions: SelectOption[] = [
  { label: "IST (GMT+5:30)", value: "ist" },
  { label: "GST (GMT+4:00)", value: "gst" },
  { label: "UTC (GMT+0:00)", value: "utc" },
];

export const locationTimezoneLabels: Record<string, string> = Object.fromEntries(
  locationTimezoneOptions.map((o) => [String(o.value), o.label])
);

export const locationDeviceOptions: SelectOption[] = [
  { label: "TF-DEVICE-018 · Face Scan Terminal", value: "tf-device-018" },
  { label: "TF-DEVICE-022 · Face Scan Terminal", value: "tf-device-022" },
  { label: "TF-DEVICE-005 · RFID Smart Gate", value: "tf-device-005" },
];
