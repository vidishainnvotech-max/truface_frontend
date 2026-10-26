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
