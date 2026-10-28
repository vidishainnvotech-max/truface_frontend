"use client";

import * as React from "react";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultSecuritySettings } from "@/config/settings-options";
import { Card } from "@/components/ui/Card";
import { Button, IconButton } from "@/components/ui/Button";
import { Input, fieldBase } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField, FormActions } from "@/components/common/Form";
import type { SecuritySettingsValues } from "@/types/settings";

export interface SecuritySettingsFormProps {
  initialValues?: Partial<SecuritySettingsValues>;
  onSubmit: (values: SecuritySettingsValues) => Promise<void> | void;
}

type Errors = Partial<Record<keyof SecuritySettingsValues, string>>;

function validate(v: SecuritySettingsValues): Errors {
  const e: Errors = {};
  if (!v.sessionTimeoutMinutes.trim()) e.sessionTimeoutMinutes = "Session timeout is required.";
  if (!v.maxLoginAttempts.trim()) e.maxLoginAttempts = "Max login attempts is required.";
  if (!v.lockoutDurationMinutes.trim()) e.lockoutDurationMinutes = "Lockout duration is required.";
  if (!v.passwordMinLength.trim()) e.passwordMinLength = "Minimum length is required.";
  if (!v.passwordExpiryDays.trim()) e.passwordExpiryDays = "Password expiry is required.";
  if (v.allowedIps.some((ip) => !ip.trim())) e.allowedIps = "IP entries cannot be empty.";
  return e;
}

function PolicyHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-subheading">{children}</h4>
  );
}

export function SecuritySettingsForm({ initialValues, onSubmit }: SecuritySettingsFormProps) {
  const [values, setValues] = React.useState<SecuritySettingsValues>({
    ...defaultSecuritySettings,
    ...initialValues,
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const set = <K extends keyof SecuritySettingsValues>(key: K, value: SecuritySettingsValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setIp = (index: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      allowedIps: prev.allowedIps.map((ip, i) => (i === index ? value : ip)),
    }));
    setSaved(false);
    if (errors.allowedIps) setErrors((prev) => ({ ...prev, allowedIps: undefined }));
  };

  const removeIp = (index: number) => {
    setValues((prev) => ({ ...prev, allowedIps: prev.allowedIps.filter((_, i) => i !== index) }));
    setSaved(false);
  };

  const addIp = () => {
    setValues((prev) => ({ ...prev, allowedIps: [...prev.allowedIps, ""] }));
    setSaved(false);
  };

  const handleReset = () => {
    setValues(defaultSecuritySettings);
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
        sessionTimeoutMinutes: values.sessionTimeoutMinutes.trim(),
        maxLoginAttempts: values.maxLoginAttempts.trim(),
        lockoutDurationMinutes: values.lockoutDurationMinutes.trim(),
        passwordMinLength: values.passwordMinLength.trim(),
        passwordExpiryDays: values.passwordExpiryDays.trim(),
        allowedIps: values.allowedIps.map((ip) => ip.trim()).filter(Boolean),
        corsAllowedOrigins: values.corsAllowedOrigins.trim(),
      });
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="lg">
        <h3 className="mb-6 text-lg font-bold text-foreground">Security &amp; Firewall Policies</h3>

        {/* Authentication Policy */}
        <PolicyHeading>Authentication Policy</PolicyHeading>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <FormField label="Session Timeout (Minutes)" htmlFor="sessionTimeoutMinutes" error={errors.sessionTimeoutMinutes}>
            <Input
              id="sessionTimeoutMinutes"
              value={values.sessionTimeoutMinutes}
              onChange={(e) => set("sessionTimeoutMinutes", e.target.value)}
              placeholder="e.g. 60"
              invalid={Boolean(errors.sessionTimeoutMinutes)}
              autoComplete="off"
            />
          </FormField>

          <FormField label="Max Login Attempts" htmlFor="maxLoginAttempts" error={errors.maxLoginAttempts}>
            <Input
              id="maxLoginAttempts"
              value={values.maxLoginAttempts}
              onChange={(e) => set("maxLoginAttempts", e.target.value)}
              placeholder="e.g. 5 attempts"
              invalid={Boolean(errors.maxLoginAttempts)}
              autoComplete="off"
            />
          </FormField>

          <FormField label="Lockout Duration (Minutes)" htmlFor="lockoutDurationMinutes" error={errors.lockoutDurationMinutes}>
            <Input
              id="lockoutDurationMinutes"
              value={values.lockoutDurationMinutes}
              onChange={(e) => set("lockoutDurationMinutes", e.target.value)}
              placeholder="e.g. 30 mins"
              invalid={Boolean(errors.lockoutDurationMinutes)}
              autoComplete="off"
            />
          </FormField>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Enforce Multi-Factor Auth (MFA)</p>
              <p className="mt-0.5 text-xs text-foreground-muted">Mandatory OIDC 2FA for all Tenant Admins</p>
            </div>
            <Switch checked={values.enforceMfa} onChange={(checked) => set("enforceMfa", checked)} />
          </div>
        </div>

        {/* Complexity & Password Policy */}
        <div className="mt-7 border-t border-border pt-7">
          <PolicyHeading>Complexity &amp; Password Policy</PolicyHeading>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Minimum Length" htmlFor="passwordMinLength" error={errors.passwordMinLength}>
              <Input
                id="passwordMinLength"
                value={values.passwordMinLength}
                onChange={(e) => set("passwordMinLength", e.target.value)}
                placeholder="e.g. 12 characters"
                invalid={Boolean(errors.passwordMinLength)}
                autoComplete="off"
              />
            </FormField>

            <FormField label="Password Expiry Days" htmlFor="passwordExpiryDays" error={errors.passwordExpiryDays}>
              <Input
                id="passwordExpiryDays"
                value={values.passwordExpiryDays}
                onChange={(e) => set("passwordExpiryDays", e.target.value)}
                placeholder="e.g. 90 days"
                invalid={Boolean(errors.passwordExpiryDays)}
                autoComplete="off"
              />
            </FormField>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-3 md:col-span-2">
              <Checkbox
                label="Require Uppercase"
                checked={values.requireUppercase}
                onChange={(checked) => set("requireUppercase", checked)}
              />
              <Checkbox
                label="Require Numbers"
                checked={values.requireNumbers}
                onChange={(checked) => set("requireNumbers", checked)}
              />
              <Checkbox
                label="Require Special Symbols"
                checked={values.requireSpecialSymbols}
                onChange={(checked) => set("requireSpecialSymbols", checked)}
              />
            </div>
          </div>
        </div>

        {/* IP Whitelist & CORS */}
        <div className="mt-7 border-t border-border pt-7">
          <PolicyHeading>IP Whitelist &amp; CORS Configuration</PolicyHeading>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Allowed Terminal IP Addresses" htmlFor="allowedIps" error={errors.allowedIps}>
              <div id="allowedIps" className="space-y-2">
                {values.allowedIps.map((ip, index) => (
                  <div key={index} className="relative">
                    <Input
                      value={ip}
                      onChange={(e) => setIp(index, e.target.value)}
                      placeholder="e.g. 103.24.88.112/32 (Office HQ)"
                      invalid={Boolean(errors.allowedIps)}
                      autoComplete="off"
                      className="pr-10 font-mono text-sm"
                      aria-label={`Allowed IP address ${index + 1}`}
                    />
                    <IconButton
                      label={`Remove IP ${index + 1}`}
                      size="sm"
                      onClick={() => removeIp(index)}
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-danger hover:bg-danger-bg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={addIp}>
                  Add Entry
                </Button>
              </div>
            </FormField>

            <FormField
              label="CORS Allowed Origins (One per line)"
              htmlFor="corsAllowedOrigins"
              hint="Each line is one allowed origin. Wildcards like https://*.trueface.in are supported."
            >
              <textarea
                id="corsAllowedOrigins"
                value={values.corsAllowedOrigins}
                onChange={(e) => set("corsAllowedOrigins", e.target.value)}
                rows={6}
                spellCheck={false}
                className={cn(fieldBase, "min-h-32 resize-y px-3 py-2 font-mono text-sm leading-relaxed")}
              />
            </FormField>
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
            Reset to Defaults
          </Button>
          <Button type="submit" variant="secondary" loading={submitting}>
            Save Changes
          </Button>
        </FormActions>
      </Card>
    </form>
  );
}
