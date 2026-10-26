export interface GeneralSettingsValues {
  platformMasterName: string;
  globalTimezone: string;
  dataRetentionPeriod: string;
  primaryAlertEmail: string;
  maintenanceBreakMode: boolean;
  apiGatewayRateLimit: string;
  maxTenancyIsolationDbs: string;
  autoSuspendInactivePipelines: boolean;
}

export interface SettingsSection {
  label: string;
  href: string;
}

export interface SecuritySettingsValues {
  sessionTimeoutMinutes: string;
  maxLoginAttempts: string;
  lockoutDurationMinutes: string;
  enforceMfa: boolean;
  passwordMinLength: string;
  passwordExpiryDays: string;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialSymbols: boolean;
  allowedIps: string[];
  corsAllowedOrigins: string;
}

export type ApiKeyStatus = "active" | "expired";

export interface ApiKey {
  id: string;
  name: string;
  token: string;
  permissions: string;
  created: string;
  expiry: string;
  status: ApiKeyStatus;
}

export interface ApiKeyScope {
  id: string;
  label: string;
}

export interface GenerateApiKeyFormValues {
  keyName: string;
  scopes: string[];
  expirationDays: string;
}

export type EmailNotificationId =
  | "new-tenant"
  | "tenant-suspension"
  | "device-offline"
  | "daily-attendance"
  | "system-error";

export interface EmailNotificationSetting {
  recipient: string;
  enabled: boolean;
}

export interface NotificationSettingsValues {
  email: Record<EmailNotificationId, EmailNotificationSetting>;
  webhookUrl: string;
  webhookSecret: string;
  webhookEvents: string[];
  inApp: {
    lowAttendanceAlert: boolean;
    deviceSyncFailure: boolean;
    storageWarning: boolean;
    licenseExpiryReminder: boolean;
  };
}
