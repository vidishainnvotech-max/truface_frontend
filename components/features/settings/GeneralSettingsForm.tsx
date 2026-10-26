"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  dataRetentionOptions,
  defaultGeneralSettings,
  timezoneOptions,
} from "@/config/settings-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FormField, FormActions } from "@/components/common/Form";
import type { GeneralSettingsValues } from "@/types/settings";

export interface GeneralSettingsFormProps {
  initialValues?: Partial<GeneralSettingsValues>;
  onSubmit: (values: GeneralSettingsValues) => Promise<void> | void;
}

type Errors = Partial<Record<keyof GeneralSettingsValues, string>>;

function validate(v: GeneralSettingsValues): Errors {
  const e: Errors = {};
  if (!v.platformMasterName.trim()) e.platformMasterName = "Platform master name is required.";
  if (!v.primaryAlertEmail.trim()) e.primaryAlertEmail = "Primary alert email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.primaryAlertEmail.trim()))
    e.primaryAlertEmail = "Enter a valid email address.";
  if (!v.apiGatewayRateLimit.trim()) e.apiGatewayRateLimit = "Rate limit is required.";
  if (!v.maxTenancyIsolationDbs.trim()) e.maxTenancyIsolationDbs = "DB instance limit is required.";
  return e;
}

function SectionTitle({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <h3 className="mb-4 text-base font-semibold text-foreground">
      {children}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden>
          *
        </span>
      )}
    </h3>
  );
}

function ToggleCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-muted px-4 py-3">
      <Switch checked={checked} onChange={onChange} label={label} description={description} labelPosition="left" />
    </div>
  );
}

export function GeneralSettingsForm({ initialValues, onSubmit }: GeneralSettingsFormProps) {
  const [values, setValues] = React.useState<GeneralSettingsValues>({
    ...defaultGeneralSettings,
    ...initialValues,
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const set = <K extends keyof GeneralSettingsValues>(key: K, value: GeneralSettingsValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleReset = () => {
    setValues(defaultGeneralSettings);
    setErrors({});
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        platformMasterName: values.platformMasterName.trim(),
        primaryAlertEmail: values.primaryAlertEmail.trim(),
      });
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="lg">
        <SectionTitle required>General System Environment</SectionTitle>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <FormField label="Platform Master Name" htmlFor="platformMasterName" required error={errors.platformMasterName}>
            <Input
              id="platformMasterName"
              value={values.platformMasterName}
              onChange={(e) => set("platformMasterName", e.target.value)}
              placeholder="e.g. TRUEFACE SUPER CONSOLE"
              invalid={Boolean(errors.platformMasterName)}
              autoComplete="off"
            />
          </FormField>

          <FormField label="Global Default System Timezone" htmlFor="globalTimezone">
            <Select
              id="globalTimezone"
              value={values.globalTimezone}
              options={timezoneOptions}
              onChange={(v) => set("globalTimezone", v)}
            />
          </FormField>

          <FormField label="Data Retention Period" htmlFor="dataRetentionPeriod">
            <Select
              id="dataRetentionPeriod"
              value={values.dataRetentionPeriod}
              options={dataRetentionOptions}
              onChange={(v) => set("dataRetentionPeriod", v)}
            />
          </FormField>

          <FormField label="Primary Alert System Email" htmlFor="primaryAlertEmail" error={errors.primaryAlertEmail}>
            <Input
              id="primaryAlertEmail"
              type="email"
              value={values.primaryAlertEmail}
              onChange={(e) => set("primaryAlertEmail", e.target.value)}
              placeholder="alerts-engine@example.com"
              invalid={Boolean(errors.primaryAlertEmail)}
              autoComplete="email"
            />
          </FormField>

          <div className="md:col-span-2">
            <ToggleCard
              label="Global Maintenance Break Mode"
              description="Instantly redirect all tenant gates to maintenance screen. Terminals will log locally."
              checked={values.maintenanceBreakMode}
              onChange={(checked) => set("maintenanceBreakMode", checked)}
            />
          </div>
        </div>

        <div className="my-7 border-t border-border" />

        <SectionTitle>SaaS API Configurations</SectionTitle>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <FormField
            label="API Gateway Rate Limit (Requests/Min/Tenant)"
            htmlFor="apiGatewayRateLimit"
            error={errors.apiGatewayRateLimit}
          >
            <Input
              id="apiGatewayRateLimit"
              value={values.apiGatewayRateLimit}
              onChange={(e) => set("apiGatewayRateLimit", e.target.value)}
              placeholder="e.g. 5,000 requests / minute"
              invalid={Boolean(errors.apiGatewayRateLimit)}
              autoComplete="off"
            />
          </FormField>

          <FormField
            label="Maximum Tenancy Isolation DBs"
            htmlFor="maxTenancyIsolationDbs"
            error={errors.maxTenancyIsolationDbs}
          >
            <Input
              id="maxTenancyIsolationDbs"
              value={values.maxTenancyIsolationDbs}
              onChange={(e) => set("maxTenancyIsolationDbs", e.target.value)}
              placeholder="e.g. 100 DB instances"
              invalid={Boolean(errors.maxTenancyIsolationDbs)}
              autoComplete="off"
            />
          </FormField>

          <div className="md:col-span-2">
            <ToggleCard
              label="Auto-Suspend Inactive Tenant Pipelines"
              description="Automatically freeze dedicated databases when no biometric terminal sync recorded for 45 days."
              checked={values.autoSuspendInactivePipelines}
              onChange={(checked) => set("autoSuspendInactivePipelines", checked)}
            />
          </div>
        </div>

        <FormActions className="mt-8">
          {saved && (
            <span role="status" className="mr-auto inline-flex items-center gap-1.5 text-xs font-medium text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Changes saved
            </span>
          )}
          <Button type="button" variant="outline" onClick={handleReset} disabled={submitting}>
            Reset Default
          </Button>
          <Button type="submit" variant="secondary" loading={submitting}>
            Save Changes
          </Button>
        </FormActions>
      </Card>
    </form>
  );
}
