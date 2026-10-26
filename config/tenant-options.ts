import type { Status } from "@/types/common";
import type { IsolationMode } from "@/types/tenants";
import type { SelectOption } from "@/types/ui";

export const TENANT_DOMAIN_SUFFIX = "trueface.in";

export const isolationOptions: SelectOption<IsolationMode>[] = [
  { label: "Shared (Multi-Tenant)", value: "shared" },
  { label: "Dedicated (Isolated)", value: "dedicated" },
];

export const isolationLabels: Record<IsolationMode, string> = {
  shared: "Shared",
  dedicated: "Dedicated",
  "shared-cluster": "Shared Cluster",
  "dedicated-db": "Dedicated DB",
  "dedicated-cluster": "Dedicated Cluster",
};

export const tenantStatusOptions: SelectOption<Status>[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

export const timezoneOptions: SelectOption[] = [
  { label: "Asia/Kolkata (GMT+05:30)", value: "Asia/Kolkata" },
  { label: "Asia/Dubai (GMT+04:00)", value: "Asia/Dubai" },
  { label: "Asia/Singapore (GMT+08:00)", value: "Asia/Singapore" },
  { label: "Europe/London (GMT+00:00)", value: "Europe/London" },
  { label: "Europe/Berlin (GMT+01:00)", value: "Europe/Berlin" },
  { label: "Africa/Johannesburg (GMT+02:00)", value: "Africa/Johannesburg" },
  { label: "America/New_York (GMT-05:00)", value: "America/New_York" },
  { label: "America/Los_Angeles (GMT-08:00)", value: "America/Los_Angeles" },
  { label: "Australia/Sydney (GMT+10:00)", value: "Australia/Sydney" },
];

export const localeOptions: SelectOption[] = [
  { label: "en (English)", value: "en" },
  { label: "en-IN (English - India)", value: "en-IN" },
  { label: "en-US (English - United States)", value: "en-US" },
  { label: "en-GB (English - United Kingdom)", value: "en-GB" },
  { label: "hi-IN (Hindi - India)", value: "hi-IN" },
  { label: "ar-AE (Arabic - UAE)", value: "ar-AE" },
  { label: "de-DE (German - Germany)", value: "de-DE" },
];

export const regionOptions: SelectOption[] = [
  { label: "India (india)", value: "india" },
  { label: "AWS Mumbai (ap-south-1)", value: "ap-south-1" },
  { label: "AWS Singapore (ap-southeast-1)", value: "ap-southeast-1" },
  { label: "AWS Frankfurt (eu-central-1)", value: "eu-central-1" },
  { label: "AWS London (eu-west-2)", value: "eu-west-2" },
  { label: "AWS N. Virginia (us-east-1)", value: "us-east-1" },
  { label: "AWS Oregon (us-west-2)", value: "us-west-2" },
  { label: "AWS Cape Town (af-south-1)", value: "af-south-1" },
];

export const countryOptions: SelectOption[] = [
  { label: "India (IN)", value: "IN" },
  { label: "United States (US)", value: "US" },
  { label: "United Kingdom (GB)", value: "GB" },
  { label: "United Arab Emirates (AE)", value: "AE" },
  { label: "Singapore (SG)", value: "SG" },
  { label: "Germany (DE)", value: "DE" },
  { label: "Australia (AU)", value: "AU" },
  { label: "South Africa (ZA)", value: "ZA" },
];

export const countryNames: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  AE: "United Arab Emirates",
  SG: "Singapore",
  DE: "Germany",
  AU: "Australia",
  ZA: "South Africa",
};

export const defaultTenantConfig = {
  biometric_verify_mode: "facial_strict",
  allowed_ip_whitelist: ["103.44.12.0/24"],
  terminal_sync_interval_seconds: 15,
};
