export type LocationType =
  | "factory-node"
  | "corporate-hq"
  | "distribution"
  | "field-office"
  | "rnd-center"
  | "warehouse";

export type LocationStatus = "active" | "inactive";

export interface LocationListItem {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  employees: number;
  devicesActive: number;
  devicesOffline: number;
  status: LocationStatus;
}

export interface LocationFormValues {
  name: string;
  type: LocationType;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  shiftStart: string;
  shiftEnd: string;
  timezone: string;
  occupancy: string;
  deviceId: string;
  geofenceActive: boolean;
  radius: string;
  latitude: string;
  longitude: string;
}

export interface LocationWorkforceRow {
  id: string;
  name: string;
  department: string;
  method: "face" | "fingerprint" | "rfid";
  checkIn: string;
  status: "on-time" | "late";
}

export interface LocationDetails {
  presentToday: number;
  attendanceRate: number;
  workforce: LocationWorkforceRow[];
}

export interface GeofenceSettings {
  radiusM: number;
  latitude: number;
  longitude: number;
  enforced: boolean;
  spoofLock: boolean;
}

export interface FieldAgent {
  id: string;
  name: string;
  role: string;
  lastSeen: string;
  within: boolean;
  distance: string;
  battery: number;
  gpsAccuracy: string;
}
