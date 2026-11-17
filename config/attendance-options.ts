import type { SelectOption } from "@/types/ui";
import type {
  AttendanceAuthMethod,
  AttendanceVerification,
  CloudSyncState,
  WorkforceSegment,
} from "@/types/attendance";

export const dateRangeOptions: SelectOption[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 14 Days", value: "14d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Today", value: "today" },
  { label: "This Month", value: "month" },
];

export const hubOptions: SelectOption[] = [
  { label: "All Hubs", value: "all" },
  { label: "All Factory Nodes", value: "all-nodes" },
  { label: "Pune Assembly Line", value: "pune-assembly" },
  { label: "Mumbai HQ", value: "mumbai-hq" },
  { label: "Chennai Warehouse", value: "chennai-warehouse" },
  { label: "Outstation Pune", value: "outstation-pune" },
];

export const departmentFilterOptions: SelectOption[] = [
  { label: "All Production", value: "all" },
  { label: "Production", value: "production" },
  { label: "Quality QA", value: "quality" },
  { label: "Operations", value: "operations" },
  { label: "Logistics", value: "logistics" },
  { label: "Tech Ops", value: "tech-ops" },
  { label: "Management", value: "management" },
  { label: "Security", value: "security" },
  { label: "Field Staff", value: "field" },
];

export const methodOptions: SelectOption<AttendanceAuthMethod>[] = [
  { label: "All Methods", value: "all" as AttendanceAuthMethod },
  { label: "Face Verify", value: "face" },
  { label: "RFID Card", value: "rfid" },
  { label: "Fingerprint", value: "fingerprint" },
  { label: "GPS Check", value: "gps" },
  { label: "None", value: "none" },
];

export const verificationOptions: SelectOption<AttendanceVerification | "all">[] = [
  { label: "All Statuses", value: "all" },
  { label: "On Time", value: "on-time" },
  { label: "Late Entry", value: "late-entry" },
  { label: "Absent", value: "absent" },
  { label: "Failed", value: "failed" },
];

export const syncOptions: SelectOption<CloudSyncState | "all">[] = [
  { label: "All Sync", value: "all" },
  { label: "Synced", value: "synced" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export const segmentOptions: SelectOption<WorkforceSegment | "all">[] = [
  { label: "All Segments", value: "all" },
  { label: "Factory floor", value: "factory" },
  { label: "Field Staff", value: "field" },
];

export const methodLabels: Record<string, string> = {
  face: "Face Verify",
  rfid: "RFID Card",
  fingerprint: "Fingerprint",
  gps: "GPS Check",
  none: "None",
  all: "All Methods",
};

export const verificationLabels: Record<string, string> = {
  "on-time": "On Time",
  "late-entry": "Late Entry",
  absent: "Absent",
  failed: "Failed",
  all: "All Statuses",
};

export const syncLabels: Record<string, string> = {
  synced: "Synced",
  pending: "Pending",
  failed: "Failed",
  all: "All Sync",
};
