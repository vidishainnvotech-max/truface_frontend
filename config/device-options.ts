import type { Status } from "@/types/common";
import type { DeviceType, ConnectionType, AuthenticationMode } from "@/types/devices";
import type { SelectOption } from "@/types/ui";

export const deviceTypeOptions: SelectOption<DeviceType>[] = [
  { label: "Facial Reader", value: "facial-reader" },
  { label: "RFID Card Reader", value: "rfid-reader" },
  { label: "Access Terminal", value: "access-terminal" },
  { label: "IP Camera", value: "ip-camera" },
  { label: "Biometric Panel", value: "biometric-panel" },
];

export const deviceTypeLabels: Record<DeviceType, string> = {
  "facial-reader": "Facial Reader",
  "rfid-reader": "RFID Card Reader",
  "access-terminal": "Access Terminal",
  "ip-camera": "IP Camera",
  "biometric-panel": "Biometric Panel",
};

export const connectionTypeOptions: SelectOption<ConnectionType>[] = [
  { label: "Ethernet (Auto-Detect)", value: "ethernet" },
  { label: "WiFi", value: "wifi" },
  { label: "Cellular (4G/5G)", value: "cellular" },
];

export const authenticationModeOptions: SelectOption<AuthenticationMode>[] = [
  { label: "Hybrid: Local + Cloud", value: "hybrid-local-cloud" },
  { label: "Cloud Only", value: "cloud-only" },
  { label: "Local Only", value: "local-only" },
];

export const deviceStatusOptions: SelectOption<Status>[] = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Error", value: "error" },
  { label: "Pending", value: "pending" },
];

export const syncIntervalOptions: SelectOption<number>[] = [
  { label: "5 seconds", value: 5 },
  { label: "10 seconds", value: 10 },
  { label: "15 seconds", value: 15 },
  { label: "30 seconds", value: 30 },
  { label: "60 seconds", value: 60 },
];

export const tenantOptions: SelectOption[] = [
  { label: "TrueFace Demo Company", value: "TF001" },
  { label: "Acme Corporate India Ltd", value: "TF002" },
  { label: "Vanguard Tech Solutions", value: "TF003" },
  { label: "Relish Retail Group", value: "TF004" },
  { label: "Hindustan Logistics", value: "TF005" },
  { label: "Standard Bank Workspace", value: "TF006" },
  { label: "Apex Manufacturing", value: "TF007" },
  { label: "Summit Biotech Corp", value: "TF008" },
];
