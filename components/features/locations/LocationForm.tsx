"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Cpu, Radio, Wifi } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { ModalFieldLabel, ModalSectionLabel, modalFieldCls } from "@/components/features/dashboard/quick-modal-ui";
import {
  locationDeviceOptions,
  locationFormTypeOptions,
  locationStateOptions,
  locationTimeOptions,
  locationTimezoneOptions,
} from "@/config/location-options";
import { cn } from "@/lib/utils";
import type { LocationFormValues, LocationType } from "@/types/locations";

export interface LocationFormProps {
  mode: "create" | "edit";
  initialValues?: LocationFormValues;
  onSubmit: (values: LocationFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

type Errors = Partial<Record<keyof LocationFormValues, string>>;

const deviceCards = [
  { id: "tf-device-018", name: "TF-DEVICE-018", meta: "Face Scan Terminal", Icon: Cpu },
  { id: "tf-device-022", name: "TF-DEVICE-022", meta: "Face Scan Terminal", Icon: Wifi },
  { id: "tf-device-005", name: "TF-DEVICE-005", meta: "RFID Smart Gate", Icon: Radio },
];

function validate(v: LocationFormValues): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Location name is required.";
  if (!v.address.trim()) e.address = "Full address is required.";
  if (!v.city.trim()) e.city = "City is required.";
  if (!v.pinCode.trim()) e.pinCode = "Pin code is required.";
  else if (!/^\d{6}$/.test(v.pinCode.trim())) e.pinCode = "Enter a valid 6-digit pin code.";
  if (!v.radius.trim()) e.radius = "Geofence radius is required.";
  if (!v.latitude.trim()) e.latitude = "Latitude is required.";
  if (!v.longitude.trim()) e.longitude = "Longitude is required.";
  return e;
}

export function LocationForm({ mode, initialValues, onSubmit, onCancel }: LocationFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = React.useState<LocationFormValues>(
    () =>
      initialValues ?? {
        name: "",
        type: "factory-node",
        address: "",
        city: "",
        state: "mh",
        pinCode: "",
        shiftStart: "09:00 AM",
        shiftEnd: "08:00 PM",
        timezone: "ist",
        occupancy: "",
        deviceId: "tf-device-018",
        geofenceActive: true,
        radius: "150",
        latitude: "18.5204",
        longitude: "73.8567",
      }
  );
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const set = <K extends keyof LocationFormValues>(key: K, value: LocationFormValues[K]) => {
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
      toast.success(mode === "create" ? "Location node created successfully" : "Location node updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = onCancel ?? (() => router.push("/locations"));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          <Card>
            <ModalSectionLabel>1. Basic Location Information</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <ModalFieldLabel htmlFor="loc-name" required>
                  Location Name
                </ModalFieldLabel>
                <Input
                  id="loc-name"
                  required
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Noida Plant Sector 62"
                  className={cn(modalFieldCls, errors.name && "border-danger")}
                  invalid={Boolean(errors.name)}
                  disabled={submitting}
                />
                {errors.name && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-type" required>
                  Location Type
                </ModalFieldLabel>
                <Select<LocationType>
                  id="loc-type"
                  options={locationFormTypeOptions}
                  value={values.type}
                  onChange={(v) => set("type", v)}
                  className={modalFieldCls}
                  disabled={submitting}
                />
              </div>
              <div className="sm:col-span-2">
                <ModalFieldLabel htmlFor="loc-address" required>
                  Full Address / Industrial Estate Coordinates
                </ModalFieldLabel>
                <Input
                  id="loc-address"
                  required
                  value={values.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="e.g. Plot 24, Phase 3, Industrial Area Sector 62"
                  className={cn(modalFieldCls, errors.address && "border-danger")}
                  invalid={Boolean(errors.address)}
                  disabled={submitting}
                />
                {errors.address && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-city" required>
                  City
                </ModalFieldLabel>
                <Input
                  id="loc-city"
                  required
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Noida"
                  className={cn(modalFieldCls, errors.city && "border-danger")}
                  invalid={Boolean(errors.city)}
                  disabled={submitting}
                />
                {errors.city && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.city}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ModalFieldLabel htmlFor="loc-state" required>
                    State
                  </ModalFieldLabel>
                  <Select
                    id="loc-state"
                    options={locationStateOptions}
                    value={values.state}
                    onChange={(v) => set("state", v)}
                    className={modalFieldCls}
                    disabled={submitting}
                  />
                </div>
                <div>
                  <ModalFieldLabel htmlFor="loc-pin" required>
                    Pin Code
                  </ModalFieldLabel>
                  <Input
                    id="loc-pin"
                    required
                    inputMode="numeric"
                    value={values.pinCode}
                    onChange={(e) => set("pinCode", e.target.value)}
                    placeholder="201301"
                    className={cn(modalFieldCls, errors.pinCode && "border-danger")}
                    invalid={Boolean(errors.pinCode)}
                    disabled={submitting}
                  />
                  {errors.pinCode && (
                    <p role="alert" className="mt-1 text-xs text-danger">
                      {errors.pinCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <ModalSectionLabel>2. Operations &amp; Shift Windows</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <ModalFieldLabel htmlFor="loc-shift-start">Shift Start Time</ModalFieldLabel>
                <Select
                  id="loc-shift-start"
                  options={locationTimeOptions}
                  value={values.shiftStart}
                  onChange={(v) => set("shiftStart", v)}
                  className={modalFieldCls}
                  disabled={submitting}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-shift-end">Shift End Time</ModalFieldLabel>
                <Select
                  id="loc-shift-end"
                  options={locationTimeOptions}
                  value={values.shiftEnd}
                  onChange={(v) => set("shiftEnd", v)}
                  className={modalFieldCls}
                  disabled={submitting}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-timezone" required>
                  Standard Timezone
                </ModalFieldLabel>
                <Select
                  id="loc-timezone"
                  options={locationTimezoneOptions}
                  value={values.timezone}
                  onChange={(v) => set("timezone", v)}
                  className={modalFieldCls}
                  disabled={submitting}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-occupancy">Max Operator Occupancy</ModalFieldLabel>
                <Input
                  id="loc-occupancy"
                  inputMode="numeric"
                  value={values.occupancy}
                  onChange={(e) => set("occupancy", e.target.value)}
                  placeholder="e.g. 1200 Workers"
                  className={modalFieldCls}
                  disabled={submitting}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card>
            <ModalSectionLabel>3. Biometric Edge Devices</ModalSectionLabel>
            <p className="mb-3 text-xs text-foreground-muted">
              Choose thermal face recognition scanners to associate with this location node.
            </p>
            <div className="space-y-2.5">
              {deviceCards.map((device) => {
                const selected = values.deviceId === device.id;
                return (
                  <button
                    key={device.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={submitting}
                    onClick={() => set("deviceId", device.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                      selected
                        ? "border-cta bg-info-bg/50 shadow-sm"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted",
                      submitting && "opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                        selected ? "bg-cta text-white" : "bg-neutral-bg text-neutral"
                      )}
                    >
                      <device.Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[13px] font-bold text-foreground">{device.name}</span>
                      <span className="block text-[11px] text-foreground-muted">{device.meta}</span>
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2",
                        selected ? "border-cta" : "border-border-strong"
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-cta" />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 hidden">
              <Select options={locationDeviceOptions} value={values.deviceId} onChange={(v) => set("deviceId", v)} />
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between gap-3">
              <ModalSectionLabel className="mb-0">4. Geofencing Boundary</ModalSectionLabel>
              <span className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-success">
                  {values.geofenceActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={values.geofenceActive}
                  onChange={(v) => set("geofenceActive", v)}
                  size="sm"
                  disabled={submitting}
                />
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <ModalFieldLabel htmlFor="loc-radius" required>
                  Geofence GPS Radius (meters)
                </ModalFieldLabel>
                <Input
                  id="loc-radius"
                  inputMode="numeric"
                  value={values.radius}
                  onChange={(e) => set("radius", e.target.value)}
                  placeholder="150 meters"
                  className={cn(modalFieldCls, errors.radius && "border-danger")}
                  invalid={Boolean(errors.radius)}
                  disabled={submitting}
                />
                {errors.radius && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.radius}
                  </p>
                )}
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-lat" required>
                  Latitude
                </ModalFieldLabel>
                <Input
                  id="loc-lat"
                  value={values.latitude}
                  onChange={(e) => set("latitude", e.target.value)}
                  className={cn(modalFieldCls, errors.latitude && "border-danger")}
                  invalid={Boolean(errors.latitude)}
                  disabled={submitting}
                />
                {errors.latitude && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.latitude}
                  </p>
                )}
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-lng" required>
                  Longitude
                </ModalFieldLabel>
                <Input
                  id="loc-lng"
                  value={values.longitude}
                  onChange={(e) => set("longitude", e.target.value)}
                  className={cn(modalFieldCls, errors.longitude && "border-danger")}
                  invalid={Boolean(errors.longitude)}
                  disabled={submitting}
                />
                {errors.longitude && (
                  <p role="alert" className="mt-1 text-xs text-danger">
                    {errors.longitude}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom corner — both actions side by side */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        <Button variant="secondary" onClick={cancel} disabled={submitting} className="min-w-40">
          Cancel &amp; Go Back
        </Button>
        <Button
          type="submit"
          loading={submitting}
          className="min-w-44 bg-cta text-white hover:bg-cta-hover active:bg-cta-active"
        >
          {mode === "create" ? "Save Location Node" : "Update Location Node"}
        </Button>
      </div>
    </form>
  );
}
