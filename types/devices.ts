import type { Status } from "./common";

export type DeviceType = "facial-reader" | "rfid-reader" | "access-terminal" | "ip-camera" | "biometric-panel";
export type ConnectionType = "ethernet" | "wifi" | "cellular";
export type AuthenticationMode = "hybrid-local-cloud" | "cloud-only" | "local-only";

export interface Device {
  id: string;
  serial: string;
  name: string;
  deviceType: DeviceType;
  model: string;
  tenant: string;
  tenantId: string;
  location: string;
  floor: string;
  ipAddress: string;
  macAddress: string;
  connectionType: ConnectionType;
  httpEndpoint: string;
  deviceSecretKey: string;
  apiEndpoint: string;
  syncInterval: number;
  authenticationMode: AuthenticationMode;
  storageCapacity: string;
  heartbeatMonitoring: boolean;
  autoFirmwareUpdate: boolean;
  firmwareVersion: string;
  status: Status;
  lastSeen: string;
}

export interface DeviceFormValues {
  serial: string;
  name: string;
  deviceType: DeviceType;
  model: string;
  tenantId: string;
  location: string;
  floor: string;
  ipAddress: string;
  macAddress: string;
  connectionType: ConnectionType;
  httpEndpoint: string;
  deviceSecretKey: string;
  apiEndpoint: string;
  syncInterval: number;
  authenticationMode: AuthenticationMode;
  storageCapacity: string;
  heartbeatMonitoring: boolean;
  autoFirmwareUpdate: boolean;
}

export type DeviceListStatus = "online" | "warning" | "offline";
export type DeviceScanMode = "face-rfid" | "fingerprint" | "rfid-only";

export interface DeviceListItem {
  id: string;
  serial: string;
  name: string;
  location: string;
  typeLabel: DeviceScanMode;
  lastSync: string;
  pendingQueue: number;
  status: DeviceListStatus;
}

export interface DeviceDiagnosticEvent {
  id: string;
  time: string;
  category: "Attendance" | "System Log" | "Security Alert";
  message: string;
  result: "Success" | "Info" | "Warning";
}

export interface DeviceDiagnostics {
  verificationEvents: number;
  pendingQueue: number;
  failedIncidents: number;
  uptime30d: number;
  lastSynced: string;
  firmwareVersion: string;
  deviceTypeLabel: string;
  assignedLocation: string;
  online: boolean;
  events: DeviceDiagnosticEvent[];
}

export interface SyncNodeRow {
  id: string;
  serial: string;
  name: string;
  plant: string;
  pending: number;
  synced: number;
  lastHeartbeat: string;
  progress: number;
  status: "synced" | "syncing" | "failed";
}

export interface SyncCenterStats {
  pendingDevices: number;
  totalTransmitted24h: number;
  failedLogs: number;
  lastFullSync: string;
}
