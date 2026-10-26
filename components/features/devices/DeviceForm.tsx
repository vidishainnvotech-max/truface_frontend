"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  authenticationModeOptions,
  connectionTypeOptions,
  deviceTypeOptions,
  syncIntervalOptions,
  tenantOptions,
} from "@/config/device-options";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FormField, FormActions } from "@/components/common/Form";
import { SettingRow } from "@/components/common/SettingRow";
import type { AuthenticationMode, ConnectionType, DeviceFormValues, DeviceType } from "@/types/devices";

export interface DeviceFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<DeviceFormValues>;
  onSubmit: (values: DeviceFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

const emptyValues: DeviceFormValues = {
  serial: "",
  name: "",
  deviceType: "facial-reader",
  model: "",
  tenantId: "",
  location: "",
  floor: "",
  ipAddress: "",
  macAddress: "",
  connectionType: "ethernet",
  httpEndpoint: "https://api.trueface.in/v1",
  deviceSecretKey: "",
  apiEndpoint: "https://api.trueface.in/v2/devices",
  syncInterval: 15,
  authenticationMode: "hybrid-local-cloud",
  storageCapacity: "",
  heartbeatMonitoring: true,
  autoFirmwareUpdate: true,
};

type Errors = Partial<Record<keyof DeviceFormValues, string>>;

function validate(v: DeviceFormValues): Errors {
  const e: Errors = {};
  if (!v.serial.trim()) e.serial = "Serial ID is required.";
  if (!v.name.trim()) e.name = "Device name is required.";
  if (!v.model.trim()) e.model = "Model is required.";
  if (!v.tenantId) e.tenantId = "Assign to a tenant.";
  if (!v.location.trim()) e.location = "Physical location is required.";
  return e;
}

export function DeviceForm({ mode, initialValues, onSubmit, onCancel, submitLabel }: DeviceFormProps) {
  const router = useRouter();
  const [values, setValues] = React.useState<DeviceFormValues>({ ...emptyValues, ...initialValues });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const set = <K extends keyof DeviceFormValues>(key: K, value: DeviceFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = onCancel ?? (() => router.back());

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-6">
        {/* Section 1: Device Hardware Details */}
        <Card padding="lg">
          <h3 className="mb-5 text-base font-semibold text-primary">Device Hardware Details</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Device Serial ID" htmlFor="serial" required error={errors.serial}>
              <Input
                id="serial"
                value={values.serial}
                onChange={(e) => set("serial", e.target.value)}
                placeholder="e.g. TF-8821-A"
                invalid={Boolean(errors.serial)}
                disabled={mode === "edit"}
                autoComplete="off"
                className="font-mono"
              />
            </FormField>

            <FormField label="Device Name" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Lobby Terminal A"
                invalid={Boolean(errors.name)}
              />
            </FormField>

            <FormField label="Device Type" htmlFor="deviceType">
              <Select<DeviceType>
                id="deviceType"
                value={values.deviceType}
                options={deviceTypeOptions}
                onChange={(v) => set("deviceType", v)}
              />
            </FormField>

            <FormField label="Model / Manufacturer" htmlFor="model" required error={errors.model}>
              <Input
                id="model"
                value={values.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="e.g. Face Gen 4.0 A1"
                invalid={Boolean(errors.model)}
              />
            </FormField>

            <FormField label="MAC Address" htmlFor="macAddress">
              <Input
                id="macAddress"
                value={values.macAddress}
                onChange={(e) => set("macAddress", e.target.value)}
                placeholder="e.g. AA:BB:CC:DD:EE:FF"
                className="font-mono"
              />
            </FormField>
          </div>
        </Card>

        {/* Section 2: Tenant & Physical Assignment */}
        <Card padding="lg">
          <h3 className="mb-5 text-base font-semibold text-primary">Tenant &amp; Physical Assignment</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Assign to Tenant" htmlFor="tenantId" required error={errors.tenantId}>
              <Select
                id="tenantId"
                value={values.tenantId}
                options={[{ label: "Select tenant", value: "" }, ...tenantOptions]}
                onChange={(v) => set("tenantId", v)}
              />
            </FormField>

            <FormField label="Physical Location" htmlFor="location" required error={errors.location}>
              <Input
                id="location"
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Ground Floor Gate A"
                invalid={Boolean(errors.location)}
              />
            </FormField>

            <FormField label="Floor / Branch" htmlFor="floor">
              <Input
                id="floor"
                value={values.floor}
                onChange={(e) => set("floor", e.target.value)}
                placeholder="e.g. Floor 1, Wing B"
              />
            </FormField>

            <FormField label="IP Address" htmlFor="ipAddress">
              <Input
                id="ipAddress"
                value={values.ipAddress}
                onChange={(e) => set("ipAddress", e.target.value)}
                placeholder="e.g. 192.168.1.101"
                className="font-mono"
              />
            </FormField>
          </div>
        </Card>

        {/* Section 3: Configuration & Operational Modes */}
        <Card padding="lg">
          <h3 className="mb-5 text-base font-semibold text-primary">Configuration &amp; Operational Modes</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Sync Interval" htmlFor="syncInterval">
              <Select
                id="syncInterval"
                value={values.syncInterval}
                options={syncIntervalOptions}
                onChange={(v) => set("syncInterval", Number(v))}
              />
            </FormField>

            <FormField label="Authentication Mode" htmlFor="authenticationMode">
              <Select<AuthenticationMode>
                id="authenticationMode"
                value={values.authenticationMode}
                options={authenticationModeOptions}
                onChange={(v) => set("authenticationMode", v)}
              />
            </FormField>

            <FormField label="Storage Capacity" htmlFor="storageCapacity">
              <Input
                id="storageCapacity"
                value={values.storageCapacity}
                onChange={(e) => set("storageCapacity", e.target.value)}
                placeholder="e.g. 8GB/32GB"
              />
            </FormField>
          </div>

          <div className="mt-2 divide-y divide-border border-t border-border pt-4">
            <SettingRow
              title="Enable Heartbeat Monitoring"
              description="Periodically ping the device to ensure uptime and report failures."
            >
              <Switch
                checked={values.heartbeatMonitoring}
                onChange={(v) => set("heartbeatMonitoring", v)}
              />
            </SettingRow>
            <SettingRow
              title="Enable Auto-Firmware Update"
              description="Automatically install the latest firmware on device reboot or schedule."
            >
              <Switch
                checked={values.autoFirmwareUpdate}
                onChange={(v) => set("autoFirmwareUpdate", v)}
              />
            </SettingRow>
          </div>
        </Card>

        {/* Section 4: Network Connectivity & Security Keys */}
        <Card padding="lg">
          <h3 className="mb-5 text-base font-semibold text-primary">Network Connectivity &amp; Security Keys</h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField label="Connection Type" htmlFor="connectionType">
              <Select<ConnectionType>
                id="connectionType"
                value={values.connectionType}
                options={connectionTypeOptions}
                onChange={(v) => set("connectionType", v)}
              />
            </FormField>

            <FormField label="HTTPS Endpoint" htmlFor="httpEndpoint">
              <Input
                id="httpEndpoint"
                value={values.httpEndpoint}
                onChange={(e) => set("httpEndpoint", e.target.value)}
                placeholder="https://api.trueface.in/v1"
                className="font-mono text-sm"
              />
            </FormField>

            <FormField label="Device Secret Key" htmlFor="deviceSecretKey">
              <Input
                id="deviceSecretKey"
                value={values.deviceSecretKey}
                onChange={(e) => set("deviceSecretKey", e.target.value)}
                placeholder="sk_live_..."
                className="font-mono text-sm"
              />
            </FormField>

            <FormField label="API Endpoint" htmlFor="apiEndpoint">
              <Input
                id="apiEndpoint"
                value={values.apiEndpoint}
                onChange={(e) => set("apiEndpoint", e.target.value)}
                placeholder="https://api.trueface.in/v2/devices"
                className="font-mono text-sm"
              />
            </FormField>
          </div>
        </Card>

        <FormActions>
          <Button type="button" variant="ghost" onClick={cancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {submitLabel ?? (mode === "create" ? "Register Device" : "Save Changes")}
          </Button>
        </FormActions>
      </div>
    </form>
  );
}
