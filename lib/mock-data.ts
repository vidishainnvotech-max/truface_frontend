import type { Tenant } from "@/types/tenants";
import type { Device } from "@/types/devices";
import type { ExportRecord } from "@/types/reports";
import type { SeriesDatum, ChartDatum } from "@/types/charts";
import type { Status } from "@/types/common";

const t = (
  n: number,
  name: string,
  status: Status,
  isolation: Tenant["isolation"],
  timezone: string,
  country: string,
  countryCode: string,
  createdAt: string,
  extra: Partial<Tenant> = {}
): Tenant => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    id: `TF${String(n).padStart(3, "0")}`,
    numericId: n,
    code: `TF${String(n).padStart(3, "0")}`,
    name,
    slug,
    domainSlug: `${slug}.trueface.in`,
    status,
    isolation,
    timezone,
    locale: "en-IN",
    region: "ap-south-1",
    country,
    countryCode,
    plan: "Business",
    users: 120,
    devices: 4,
    createdAt,
    ...extra,
  };
};

export const mockTenants: Tenant[] = [
  t(1, "TrueFace Demo Company", "active", "shared-cluster", "Asia/Kolkata", "India", "IN", "2024-01-10", { plan: "Enterprise", users: 1240, devices: 24 }),
  t(2, "Acme Corporate India Ltd", "active", "dedicated-db", "Asia/Kolkata", "India", "IN", "2024-01-15", { users: 380, devices: 9 }),
  t(3, "Vanguard Tech Solutions", "inactive", "shared-cluster", "America/New_York", "USA", "US", "2024-02-01", { locale: "en-US", region: "us-east-1", users: 56, devices: 2 }),
  t(4, "Relish Retail Group", "active", "dedicated-db", "Europe/London", "UK", "GB", "2024-02-12", { locale: "en-GB", region: "eu-west-2", users: 610, devices: 12 }),
  t(5, "Hindustan Logistics", "suspended", "shared-cluster", "Asia/Kolkata", "India", "IN", "2024-02-28", { plan: "Enterprise", users: 910, devices: 17 }),
  t(6, "Standard Bank Workspace", "active", "dedicated-cluster", "Africa/Johannesburg", "S. Africa", "ZA", "2024-03-01", { region: "af-south-1", plan: "Enterprise", users: 2300, devices: 41 }),
  t(7, "Apex Manufacturing", "active", "shared-cluster", "Asia/Kolkata", "India", "IN", "2024-03-15", { users: 210, devices: 6 }),
  t(8, "Summit Biotech Corp", "active", "dedicated-db", "America/Los_Angeles", "USA", "US", "2024-03-22", { locale: "en-US", region: "us-west-2", users: 145, devices: 3 }),
];

export const MOCK_TENANT_TOTAL = 48;

const now = Date.now();

export const mockDevices: Device[] = [
  { id: "DEV001", serial: "TF-8821-A", name: "Smart Panel X", deviceType: "biometric-panel", model: "TF-8821-A1", tenant: "TrueFace Demo Company", tenantId: "TF001", location: "Kotaur Metro HQ", floor: "Ground Floor", ipAddress: "192.168.1.101", macAddress: "AA:BB:CC:11:22:33", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def456", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 15, authenticationMode: "hybrid-local-cloud", storageCapacity: "8GB/32GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.1", status: "online", lastSeen: new Date(now - 6e4).toISOString() },
  { id: "DEV002", serial: "TF-8822-B", name: "RFID Portal Reader", deviceType: "rfid-reader", model: "TF-8822-B3", tenant: "TrueFace Demo Company", tenantId: "TF001", location: "South Asian Lobby", floor: "Ground Floor", ipAddress: "192.168.1.102", macAddress: "AA:BB:CC:11:22:34", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def457", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 15, authenticationMode: "hybrid-local-cloud", storageCapacity: "8GB/32GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.1", status: "online", lastSeen: new Date(now - 12e4).toISOString() },
  { id: "DEV003", serial: "TF-8830-C", name: "Security Access Panel", deviceType: "facial-reader", model: "TF-8830-C2", tenant: "Acme Corporate India Ltd", tenantId: "TF002", location: "Delhi Data Center", floor: "Basement", ipAddress: "192.168.2.101", macAddress: "AA:BB:CC:11:22:35", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def458", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 10, authenticationMode: "hybrid-local-cloud", storageCapacity: "16GB/64GB", heartbeatMonitoring: true, autoFirmwareUpdate: false, firmwareVersion: "v4.1.8", status: "online", lastSeen: new Date(now - 18e4).toISOString() },
  { id: "DEV004", serial: "TF-8823-D", name: "Employee Check-In Kiosk", deviceType: "facial-reader", model: "TF-8823-D1", tenant: "Relish Retail Group", tenantId: "TF004", location: "Mumbai Regional Office", floor: "Floor 1", ipAddress: "192.168.3.101", macAddress: "AA:BB:CC:11:22:36", connectionType: "wifi", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def459", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 30, authenticationMode: "cloud-only", storageCapacity: "8GB/32GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.0", status: "online", lastSeen: new Date(now - 3e5).toISOString() },
  { id: "DEV005", serial: "TF-8841-E", name: "Lobby RFID Reader", deviceType: "rfid-reader", model: "TF-8841-E1", tenant: "Standard Bank Workspace", tenantId: "TF006", location: "New York City Hub", floor: "Ground Floor", ipAddress: "192.168.4.101", macAddress: "AA:BB:CC:11:22:37", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def460", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 15, authenticationMode: "hybrid-local-cloud", storageCapacity: "16GB/64GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.1", status: "online", lastSeen: new Date(now - 2.4e6).toISOString() },
  { id: "DEV006", serial: "TF-8842-F", name: "Facial Recognition Gate A", deviceType: "facial-reader", model: "TF-8842-F2", tenant: "Hindustan Logistics", tenantId: "TF005", location: "Gate A – Assembly Area", floor: "Ground Floor", ipAddress: "192.168.5.101", macAddress: "AA:BB:CC:11:22:38", connectionType: "wifi", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def461", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 30, authenticationMode: "local-only", storageCapacity: "8GB/32GB", heartbeatMonitoring: false, autoFirmwareUpdate: false, firmwareVersion: "v4.1.5", status: "offline", lastSeen: new Date(now - 8.64e7).toISOString() },
  { id: "DEV007", serial: "TF-8850-G", name: "Terminal Reader V2", deviceType: "access-terminal", model: "TF-8850-G1", tenant: "Apex Manufacturing", tenantId: "TF007", location: "Warehouse Bay 7", floor: "Floor 1", ipAddress: "192.168.6.101", macAddress: "AA:BB:CC:11:22:39", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def462", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 15, authenticationMode: "hybrid-local-cloud", storageCapacity: "16GB/64GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.1", status: "online", lastSeen: new Date(now - 6e5).toISOString() },
  { id: "DEV008", serial: "TF-8860-H", name: "Facial Reader v3 Pro", deviceType: "facial-reader", model: "TF-8860-H3", tenant: "Summit Biotech Corp", tenantId: "TF008", location: "S4 Lab Secure Entry", floor: "Floor 3", ipAddress: "192.168.7.101", macAddress: "AA:BB:CC:11:22:3A", connectionType: "ethernet", httpEndpoint: "https://api.trueface.in/v1", deviceSecretKey: "sk_live_abc123def463", apiEndpoint: "https://api.trueface.in/v2/devices", syncInterval: 10, authenticationMode: "hybrid-local-cloud", storageCapacity: "32GB/128GB", heartbeatMonitoring: true, autoFirmwareUpdate: true, firmwareVersion: "v4.2.1", status: "error", lastSeen: new Date(now - 9e5).toISOString() },
];

export const MOCK_DEVICE_TOTAL = 892;

export const mockAttendanceTrend: SeriesDatum[] = [
  { day: "Mon", checkins: 8200, late: 410 },
  { day: "Tue", checkins: 8750, late: 380 },
  { day: "Wed", checkins: 9100, late: 455 },
  { day: "Thu", checkins: 8900, late: 320 },
  { day: "Fri", checkins: 9600, late: 290 },
  { day: "Sat", checkins: 4300, late: 120 },
  { day: "Sun", checkins: 2100, late: 60 },
];

export const mockDeviceStatus: ChartDatum[] = [
  { name: "Online", value: 845, color: "#16A34A" },
  { name: "Offline", value: 32, color: "#94A3B8" },
  { name: "Error", value: 13, color: "#DC2626" },
];

export const mockSystemStatus: { name: string; status: Status; at: number }[] = [
  { name: "API Gateway", status: "active", at: now - 6e4 },
  { name: "Auth Service", status: "active", at: now - 12e4 },
  { name: "Face Recognition Engine", status: "pending", at: now - 9e5 },
  { name: "Notification Worker", status: "error", at: now - 3.6e6 },
];

export const mockPlanDistribution: SeriesDatum[] = [
  { plan: "Starter", tenants: 22 },
  { plan: "Business", tenants: 41 },
  { plan: "Enterprise", tenants: 15 },
];

export const mockRecentExports: ExportRecord[] = [
  { id: "EXP-9018", filename: "attendance_summary_all_tenants_oct26.csv", generatedBy: "Devashish Roy (Admin)", format: "CSV", fileSize: "1.4 MB", status: "ready" },
  { id: "EXP-8891", filename: "device_audit_log_kolkata_terminal.xlsx", generatedBy: "System Scheduler", format: "XLSX", fileSize: "380 KB", status: "ready" },
  { id: "EXP-8724", filename: "overtime_calculation_vanguard_shiftB.csv", generatedBy: "A. Kumar (Vanguard HR)", format: "CSV", fileSize: "840 KB", status: "ready" },
];
