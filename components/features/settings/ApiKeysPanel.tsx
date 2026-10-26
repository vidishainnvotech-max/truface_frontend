"use client";

import * as React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  apiKeyExpirationOptions,
  apiKeyScopes,
  defaultApiKeyScopes,
  mockApiKeys,
} from "@/config/settings-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TruncateText } from "@/components/common/TruncateText";
import { FormField } from "@/components/common/Form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type { ApiKey, ApiKeyScope, GenerateApiKeyFormValues } from "@/types/settings";
import type { Tone } from "@/types/common";

type Errors = Partial<Record<keyof GenerateApiKeyFormValues, string>>;

function permissionTone(permissions: string): Tone {
  if (permissions.includes("Full")) return "info";
  if (permissions.includes("Write")) return "info";
  return "neutral";
}

function permissionVariant(permissions: string): "solid" | "soft" {
  return permissions.includes("Full") ? "solid" : "soft";
}

function summarizePermissions(scopes: string[]): string {
  if (scopes.includes("full-access")) return "Full Access";
  const hasWrite = scopes.some((s) => s.startsWith("write-"));
  if (!hasWrite) return "Read-Only";
  return "Read/Write";
}

function expiryFromDays(days: string): string {
  if (days === "never") return "Never";
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function randomTokenSuffix(): string {
  return Math.random().toString(16).slice(2, 6);
}

function validate(v: GenerateApiKeyFormValues): Errors {
  const e: Errors = {};
  if (!v.keyName.trim()) e.keyName = "Key name is required.";
  if (!v.scopes.length) e.scopes = "Select at least one permission scope.";
  return e;
}

export function ApiKeysPanel() {
  const [keys, setKeys] = React.useState<ApiKey[]>(mockApiKeys);
  const [values, setValues] = React.useState<GenerateApiKeyFormValues>({
    keyName: "",
    scopes: defaultApiKeyScopes,
    expirationDays: "90",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);

  const activeCount = keys.filter((k) => k.status === "active").length;

  const toggleScope = (id: string, checked: boolean) => {
    setGenerated(false);
    setValues((prev) => ({
      ...prev,
      scopes: checked ? [...prev.scopes, id] : prev.scopes.filter((s) => s !== id),
    }));
    if (errors.scopes) setErrors((prev) => ({ ...prev, scopes: undefined }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        name: values.keyName.trim(),
        token: `tf_live_****${randomTokenSuffix()}`,
        permissions: summarizePermissions(values.scopes),
        created: today(),
        expiry: expiryFromDays(values.expirationDays),
        status: "active",
      };
      console.info("generate api key", { ...values, keyName: newKey.name }, newKey);
      setKeys((prev) => [newKey, ...prev]);
      setValues((prev) => ({ ...prev, keyName: "" }));
      setGenerated(true);
    } finally {
      setSubmitting(false);
    }
  };

  const scopeRows: ApiKeyScope[][] = [
    apiKeyScopes.slice(0, 4),
    apiKeyScopes.slice(4),
  ];

  return (
    <Card padding="lg">
      {/* Management header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-foreground">API Key Management</h3>
        <div className="flex flex-wrap items-center gap-x-6 text-sm text-foreground-muted">
          <span>
            Active Keys: <strong className="font-semibold text-foreground">{activeCount}</strong>
          </span>
          <span>
            Monthly Usage Limit: <strong className="font-semibold text-foreground">94.5%</strong>
          </span>
        </div>
      </div>

      {/* Keys table */}
      <Table striped={false} bordered={false}>
        <TableHeader className="bg-transparent [&_th]:normal-case [&_th]:text-xs [&_th]:font-medium [&_th]:text-foreground-muted">
          <TableRow>
            <TableHead>Key Name</TableHead>
            <TableHead>Key Token</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key, i) => (
            <TableRow key={key.id} className={i % 2 === 1 ? "bg-row-alt" : undefined}>
              <TableCell className="font-medium text-foreground">
                <TruncateText maxWidth="12rem">{key.name}</TruncateText>
              </TableCell>
              <TableCell className="font-mono text-xs text-foreground-secondary">{key.token}</TableCell>
              <TableCell>
                <Badge tone={permissionTone(key.permissions)} variant={permissionVariant(key.permissions)}>
                  {key.permissions}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground-secondary">{key.created}</TableCell>
              <TableCell className="text-foreground-secondary">{key.expiry}</TableCell>
              <TableCell>
                <StatusBadge status={key.status} variant="text" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="my-7 border-t border-border" />

      {/* Generate + rate limits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <form onSubmit={handleGenerate} noValidate>
          <h3 className="mb-5 text-base font-semibold text-foreground">Generate New API Key</h3>

          <FormField label="Key Name" htmlFor="keyName" required error={errors.keyName}>
            <Input
              id="keyName"
              value={values.keyName}
              onChange={(e) => {
                setGenerated(false);
                setValues((prev) => ({ ...prev, keyName: e.target.value }));
                if (errors.keyName) setErrors((prev) => ({ ...prev, keyName: undefined }));
              }}
              placeholder="e.g. Chicago Office Terminal Sync"
              invalid={Boolean(errors.keyName)}
              autoComplete="off"
            />
          </FormField>

          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-foreground">Key Permissions Scope</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {scopeRows[0].map((scope) => (
                <Checkbox
                  key={scope.id}
                  label={scope.label}
                  checked={values.scopes.includes(scope.id)}
                  onChange={(checked) => toggleScope(scope.id, checked)}
                />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3">
              {scopeRows[1].map((scope) => (
                <Checkbox
                  key={scope.id}
                  label={scope.label}
                  checked={values.scopes.includes(scope.id)}
                  onChange={(checked) => toggleScope(scope.id, checked)}
                />
              ))}
            </div>

            {errors.scopes && (
              <p role="alert" className="mt-2 text-xs text-danger">
                {errors.scopes}
              </p>
            )}
          </div>

          <div className="mt-5 max-w-sm">
            <FormField label="Key Expiration" htmlFor="expirationDays">
              <Select
                id="expirationDays"
                value={values.expirationDays}
                options={apiKeyExpirationOptions}
                onChange={(v) => {
                  setGenerated(false);
                  setValues((prev) => ({ ...prev, expirationDays: v }));
                }}
              />
            </FormField>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button type="submit" variant="secondary" loading={submitting}>
              Generate Key
            </Button>
            {generated && (
              <span role="status" className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden />
                API key generated
              </span>
            )}
          </div>
        </form>

        {/* Rate limits aside */}
        <aside className="rounded-lg border border-secondary/20 bg-info-bg/40 p-5">
          <div className="flex items-center gap-2 text-secondary">
            <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden />
            <h4 className="text-sm font-semibold">SaaS Rate Limits &amp; Security</h4>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground-secondary">
            All Super Admin API tokens are rate-limited globally to{" "}
            <strong className="font-semibold text-foreground">5,000 requests/minute</strong> per tenant.
          </p>

          <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
            To avoid disruptions, restrict key scope to minimum required scopes and enforce CORS policies under firewall
            settings.
          </p>

          <div className="mt-5 border-t border-secondary/15 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted">CORS Restriction</p>
            <p className="mt-1 text-sm font-medium text-foreground">Strict Origin Match Handshake Enforced</p>
          </div>
        </aside>
      </div>
    </Card>
  );
}
