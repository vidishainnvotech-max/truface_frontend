import type { SelectOption } from "@/types/ui";
import type {
  ApiKey,
  ApiKeyScope,
  EmailNotificationId,
  GeneralSettingsValues,
  NotificationSettingsValues,
  SecuritySettingsValues,
  SettingsSection,
} from "@/types/settings";

export const settingsSections: SettingsSection[] = [
  { label: "General Settings", href: "/settings" },
  { label: "Security & Firewall", href: "/settings/security" },
  { label: "SaaS API Keys", href: "/settings/api-keys" },
  { label: "System Notifications", href: "/settings/notifications" },
  { label: "Audit Trail Logs", href: "/settings/audit-logs" },
  { label: "Global Health Checklist", href: "/settings/health" },
];

export const timezoneOptions: SelectOption[] = [
  { label: "Asia/Kolkata (GMT+05:30)", value: "Asia/Kolkata" },
  { label: "Asia/Dubai (GMT+04:00)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (GMT+08:00)", value: "Asia/Singapore" },
  { label: "Europe/London (GMT+00:00)", value: "Europe/London" },
  { label: "America/New_York (GMT-05:00)", value: "America/New_York" },
  { label: "Australia/Sydney (GMT+10:00)", value: "Australia/Sydney" },
  { label: "UTC (GMT+00:00)", value: "UTC" },
];

export const dataRetentionOptions: SelectOption[] = [
  { label: "30 Days (Short-term Logs)", value: "30" },
  { label: "90 Days (Quarterly Logs History)", value: "90" },
  { label: "180 Days (Half-year Logs History)", value: "180" },
  { label: "365 Days (1 Year Logs History)", value: "365" },
  { label: "730 Days (2 Year Logs History)", value: "730" },
];

export const defaultGeneralSettings: GeneralSettingsValues = {
  platformMasterName: "TRUEFACE SUPER CONSOLE",
  globalTimezone: "Asia/Kolkata",
  dataRetentionPeriod: "365",
  primaryAlertEmail: "alerts-engine@trueface.in",
  maintenanceBreakMode: false,
  apiGatewayRateLimit: "5,000 requests / minute",
  maxTenancyIsolationDbs: "100 DB instances",
  autoSuspendInactivePipelines: true,
};

export const defaultSecuritySettings: SecuritySettingsValues = {
  sessionTimeoutMinutes: "60",
  maxLoginAttempts: "5 attempts",
  lockoutDurationMinutes: "30 mins",
  enforceMfa: true,
  passwordMinLength: "12 characters",
  passwordExpiryDays: "90 days",
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialSymbols: true,
  allowedIps: [
    "103.24.88.112/32 (Office HQ)",
    "192.168.1.0/24 (Kolkata Plant VPN)",
    "54.210.12.89 (API Gateway proxy)",
  ],
  corsAllowedOrigins: "https://*.trueface.in\nhttps://tf-terminal-bridge.com\nhttp://localhost:3000",
};

export const apiKeyScopes: ApiKeyScope[] = [
  { id: "read-tenants", label: "Read Tenants" },
  { id: "write-tenants", label: "Write Tenants" },
  { id: "read-employees", label: "Read Employees" },
  { id: "write-employees", label: "Write Employees" },
  { id: "read-devices", label: "Read Devices" },
  { id: "read-attendance", label: "Read Attendance" },
  { id: "full-access", label: "Full Access" },
];

export const apiKeyExpirationOptions: SelectOption[] = [
  { label: "30 Days", value: "30" },
  { label: "90 Days (Recommended)", value: "90" },
  { label: "180 Days", value: "180" },
  { label: "365 Days", value: "365" },
  { label: "Never Expires", value: "never" },
];

export const defaultApiKeyScopes = [
  "read-tenants",
  "read-employees",
  "read-devices",
  "read-attendance",
];

export const mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production Gateway",
    token: "tf_live_****3a9f",
    permissions: "Full Access",
    created: "2026-01-12",
    expiry: "Never",
    status: "active",
  },
  {
    id: "key-2",
    name: "Kolkata Sync Terminal",
    token: "tf_live_****8b12",
    permissions: "Read/Write Devices",
    created: "2026-02-01",
    expiry: "2027-02-01",
    status: "active",
  },
  {
    id: "key-3",
    name: "BI Analytics Tool",
    token: "tf_live_****49cd",
    permissions: "Read-Only",
    created: "2025-11-20",
    expiry: "2026-11-20",
    status: "active",
  },
  {
    id: "key-4",
    name: "Staging Environment",
    token: "tf_test_****028",
    permissions: "Read/Write",
    created: "2025-05-15",
    expiry: "2025-11-15",
    status: "expired",
  },
];

export const emailNotificationDefs: { id: EmailNotificationId; label: string; description: string }[] = [
  {
    id: "new-tenant",
    label: "New Tenant Registration",
    description: "Notify when a new tenant signs up successfully",
  },
  {
    id: "tenant-suspension",
    label: "Tenant Suspension Alerts",
    description: "Alert when dedicated DB drops below compliance parameters",
  },
  {
    id: "device-offline",
    label: "Device Offline Alert",
    description: "Trigger email alert when biometric terminal remains unresponsive > 15m",
  },
  {
    id: "daily-attendance",
    label: "Daily Attendance Summary",
    description: "Consolidated system attendance overview export",
  },
  {
    id: "system-error",
    label: "System Error Alerts",
    description: "Foreground job anomalies and Redis job backlog metrics",
  },
];

export const webhookEventOptions = [
  "tenant.created",
  "tenant.updated",
  "device.offline",
  "attendance.anomaly",
];

export const defaultNotificationSettings: NotificationSettingsValues = {
  email: {
    "new-tenant": { recipient: "ncy@trueface.in", enabled: true },
    "tenant-suspension": { recipient: "sec-alerts@trueface.in", enabled: true },
    "device-offline": { recipient: "ops-alerts@trueface.in", enabled: true },
    "daily-attendance": { recipient: "ncy@trueface.in", enabled: false },
    "system-error": { recipient: "alerts-engine@trueface.in", enabled: true },
  },
  webhookUrl: "https://api.trueface.in/webhooks/super-admin",
  webhookSecret: "tf_whsec_9fK2mXpQ7vRn4wZ1aB3cD5eF7gH8jJ2a",
  webhookEvents: [...webhookEventOptions],
  inApp: {
    lowAttendanceAlert: true,
    deviceSyncFailure: true,
    storageWarning: true,
    licenseExpiryReminder: false,
  },
};
