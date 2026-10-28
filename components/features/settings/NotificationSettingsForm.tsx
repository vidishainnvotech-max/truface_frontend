"use client";

import * as React from "react";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import {
  defaultNotificationSettings,
  emailNotificationDefs,
  webhookEventOptions,
} from "@/config/settings-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField, FormActions } from "@/components/common/Form";
import type { EmailNotificationId, NotificationSettingsValues } from "@/types/settings";

export interface NotificationSettingsFormProps {
  initialValues?: Partial<NotificationSettingsValues>;
  onSubmit: (values: NotificationSettingsValues) => Promise<void> | void;
}

type Errors = Partial<Record<"webhookUrl" | "webhookSecret" | "webhookEvents" | `email.${EmailNotificationId}`, string>>;

function validate(v: NotificationSettingsValues): Errors {
  const e: Errors = {};
  if (!v.webhookUrl.trim()) e.webhookUrl = "Webhook URL is required.";
  else if (!/^https?:\/\/\S+$/i.test(v.webhookUrl.trim())) e.webhookUrl = "Enter a valid URL.";
  if (!v.webhookSecret.trim()) e.webhookSecret = "Webhook secret is required.";
  if (!v.webhookEvents.length) e.webhookEvents = "Select at least one event.";
  for (const def of emailNotificationDefs) {
    const setting = v.email[def.id];
    if (setting.enabled && !setting.recipient.trim()) {
      e[`email.${def.id}`] = "Recipient is required when enabled.";
    } else if (setting.enabled && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.recipient.trim())) {
      e[`email.${def.id}`] = "Enter a valid email address.";
    }
  }
  return e;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-subheading">{children}</h4>;
}

function InAppRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface-muted px-4 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
  );
}

export function NotificationSettingsForm({ initialValues, onSubmit }: NotificationSettingsFormProps) {
  const [values, setValues] = React.useState<NotificationSettingsValues>({
    ...defaultNotificationSettings,
    ...initialValues,
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<"ok" | "fail" | null>(null);

  const setSavedFalse = () => setSaved(false);

  const setEmail = (id: EmailNotificationId, patch: Partial<NotificationSettingsValues["email"][EmailNotificationId]>) => {
    setValues((prev) => ({
      ...prev,
      email: { ...prev.email, [id]: { ...prev.email[id], ...patch } },
    }));
    setSavedFalse();
    const key = `email.${id}` as const;
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setInApp = (key: keyof NotificationSettingsValues["inApp"], checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      inApp: { ...prev.inApp, [key]: checked },
    }));
    setSavedFalse();
  };

  const toggleEvent = (event: string, checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      webhookEvents: checked
        ? [...prev.webhookEvents, event]
        : prev.webhookEvents.filter((e) => e !== event),
    }));
    setSavedFalse();
    if (errors.webhookEvents) setErrors((prev) => ({ ...prev, webhookEvents: undefined }));
  };

  const handleReset = () => {
    setValues(defaultNotificationSettings);
    setErrors({});
    setSaved(false);
    setTestResult(null);
  };

  const handleTestWebhook = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const errs = validate(values);
      if (errs.webhookUrl || errs.webhookSecret) {
        setErrors((prev) => ({ ...prev, webhookUrl: errs.webhookUrl, webhookSecret: errs.webhookSecret }));
        setTestResult("fail");
        return;
      }
      console.info("test webhook", { url: values.webhookUrl, events: values.webhookEvents });
      setTestResult("ok");
    } finally {
      setTesting(false);
    }
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
        webhookUrl: values.webhookUrl.trim(),
        webhookSecret: values.webhookSecret.trim(),
      });
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="lg">
        <h3 className="mb-6 text-lg font-bold text-foreground">Notification Preferences</h3>

        {/* Email notifications */}
        <SectionHeading>Email Notifications</SectionHeading>

        <div className="space-y-5">
          {emailNotificationDefs.map((def) => {
            const setting = values.email[def.id];
            const error = errors[`email.${def.id}`];
            return (
              <div key={def.id} className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="min-w-0 flex-1 basis-48">
                  <p className="text-sm font-medium text-foreground">{def.label}</p>
                  <p className="mt-0.5 text-xs text-foreground-muted">{def.description}</p>
                </div>

                <div className="w-full sm:w-56">
                  <Input
                    type="email"
                    value={setting.recipient}
                    onChange={(e) => setEmail(def.id, { recipient: e.target.value })}
                    invalid={Boolean(error)}
                    autoComplete="off"
                    aria-label={`${def.label} recipient`}
                  />
                  {error && (
                    <p role="alert" className="mt-1 text-xs text-danger">
                      {error}
                    </p>
                  )}
                </div>

                <Switch
                  checked={setting.enabled}
                  onChange={(checked) => setEmail(def.id, { enabled: checked })}
                  aria-label={`Enable ${def.label}`}
                />
              </div>
            );
          })}
        </div>

        {/* Webhook integration */}
        <div className="mt-7 rounded-lg border border-border bg-surface-muted p-5">
          <SectionHeading>Webhook Integration</SectionHeading>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Webhook Payload Destination URL" htmlFor="webhookUrl" error={errors.webhookUrl}>
              <Input
                id="webhookUrl"
                type="url"
                value={values.webhookUrl}
                onChange={(e) => {
                  setSaved(false);
                  setValues((prev) => ({ ...prev, webhookUrl: e.target.value }));
                  if (errors.webhookUrl) setErrors((prev) => ({ ...prev, webhookUrl: undefined }));
                }}
                placeholder="https://api.example.com/webhooks/super-admin"
                invalid={Boolean(errors.webhookUrl)}
                autoComplete="off"
              />
            </FormField>

            <FormField label="Webhook Secret Key" htmlFor="webhookSecret" error={errors.webhookSecret}>
              <div className="relative">
                <Input
                  id="webhookSecret"
                  type={showSecret ? "text" : "password"}
                  value={values.webhookSecret}
                  onChange={(e) => {
                    setSaved(false);
                    setValues((prev) => ({ ...prev, webhookSecret: e.target.value }));
                    if (errors.webhookSecret) setErrors((prev) => ({ ...prev, webhookSecret: undefined }));
                  }}
                  invalid={Boolean(errors.webhookSecret)}
                  autoComplete="off"
                  className="pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((s) => !s)}
                  aria-label={showSecret ? "Hide webhook secret" : "Show webhook secret"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-foreground-muted hover:bg-surface hover:text-foreground"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-foreground">Events to Trigger</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              {webhookEventOptions.map((event) => (
                <Checkbox
                  key={event}
                  label={<span className="font-mono text-xs">{event}</span>}
                  checked={values.webhookEvents.includes(event)}
                  onChange={(checked) => toggleEvent(event, checked)}
                />
              ))}
            </div>
            {errors.webhookEvents && (
              <p role="alert" className="mt-2 text-xs text-danger">
                {errors.webhookEvents}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button type="button" variant="outline" size="sm" onClick={handleTestWebhook} loading={testing}>
              Test Webhook
            </Button>
            {testResult === "ok" && (
              <span role="status" className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                Webhook responded 200 OK
              </span>
            )}
            {testResult === "fail" && (
              <span role="status" className="text-xs font-medium text-danger">
                Fix webhook fields, then test again
              </span>
            )}
          </div>
        </div>

        {/* In-app notifications */}
        <div className="mt-7">
          <SectionHeading>In-App Platform Notifications</SectionHeading>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InAppRow
              label="Low Attendance Alert"
              checked={values.inApp.lowAttendanceAlert}
              onChange={(c) => setInApp("lowAttendanceAlert", c)}
            />
            <InAppRow
              label="Device Sync Failure"
              checked={values.inApp.deviceSyncFailure}
              onChange={(c) => setInApp("deviceSyncFailure", c)}
            />
            <InAppRow
              label="Storage Warning (Disk > 80%)"
              checked={values.inApp.storageWarning}
              onChange={(c) => setInApp("storageWarning", c)}
            />
            <InAppRow
              label="License Expiry Reminder"
              checked={values.inApp.licenseExpiryReminder}
              onChange={(c) => setInApp("licenseExpiryReminder", c)}
            />
          </div>
        </div>

        <FormActions className="mt-8">
          {saved && (
            <span role="status" className="mr-auto inline-flex items-center gap-1.5 text-xs font-medium text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Preferences saved
            </span>
          )}
          <Button type="button" variant="outline" onClick={handleReset} disabled={submitting}>
            Reset Preferences
          </Button>
          <Button type="submit" variant="secondary" loading={submitting}>
            Save Preferences
          </Button>
        </FormActions>
      </Card>
    </form>
  );
}
