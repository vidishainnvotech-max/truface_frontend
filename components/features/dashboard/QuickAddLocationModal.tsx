"use client";

import * as React from "react";
import { Cpu, Radio, Wifi } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import {
  ModalFieldLabel,
  ModalSectionLabel,
  QuickModalFooter,
  modalFieldCls,
} from "./quick-modal-ui";

const FORM_ID = "quick-add-location";

const locationTypeOptions = [
  { value: "factory", label: "Factory" },
  { value: "warehouse", label: "Warehouse" },
  { value: "office", label: "Corporate Office" },
  { value: "branch", label: "Branch" },
  { value: "site", label: "Field Site" },
];

const stateOptions = [
  { value: "up", label: "Uttar Pradesh" },
  { value: "mh", label: "Maharashtra" },
  { value: "tn", label: "Tamil Nadu" },
  { value: "ka", label: "Karnataka" },
  { value: "dl", label: "Delhi" },
];

const timeOptions = [
  { value: "06:00 AM", label: "06:00 AM" },
  { value: "07:00 AM", label: "07:00 AM" },
  { value: "08:00 AM", label: "08:00 AM" },
  { value: "09:00 AM", label: "09:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "06:00 PM", label: "06:00 PM" },
  { value: "07:00 PM", label: "07:00 PM" },
  { value: "08:00 PM", label: "08:00 PM" },
  { value: "09:00 PM", label: "09:00 PM" },
];

const timezoneOptions = [
  { value: "ist", label: "IST (GMT+5:30)" },
  { value: "gst", label: "GST (GMT+4:00)" },
  { value: "utc", label: "UTC (GMT+0:00)" },
];

const deviceOptions = [
  { id: "tf-device-018", name: "TF-DEVICE-018", meta: "Face Scan Terminal", Icon: Cpu },
  { id: "tf-device-022", name: "TF-DEVICE-022", meta: "Face Scan Terminal", Icon: Wifi },
  { id: "tf-device-005", name: "TF-DEVICE-005", meta: "RFID Smart Gate", Icon: Radio },
];

export interface QuickAddLocationModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickAddLocationModal({ open, onClose }: QuickAddLocationModalProps) {
  const [locationName, setLocationName] = React.useState("");
  const [locationType, setLocationType] = React.useState("factory");
  const [address, setAddress] = React.useState("");
  const [city, setCity] = React.useState("Noida");
  const [state, setState] = React.useState("up");
  const [pinCode, setPinCode] = React.useState("");
  const [shiftStart, setShiftStart] = React.useState("09:00 AM");
  const [shiftEnd, setShiftEnd] = React.useState("08:00 PM");
  const [timezone, setTimezone] = React.useState("ist");
  const [occupancy, setOccupancy] = React.useState("");
  const [deviceId, setDeviceId] = React.useState("tf-device-018");
  const [geofenceActive, setGeofenceActive] = React.useState(true);
  const [radius, setRadius] = React.useState("150");
  const [latitude, setLatitude] = React.useState("28.6139");
  const [longitude, setLongitude] = React.useState("77.2090");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-cta" aria-hidden />
          Quick Add Location
        </span>
      }
      footer={
        <QuickModalFooter
          formId={FORM_ID}
          actionLabel="Add Location"
        />
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-6">
        <section>
          <ModalSectionLabel>1. Basic Location Information</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="loc-name" required>
                Location Name
              </ModalFieldLabel>
              <Input
                id="loc-name"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Noida Plant Sector 63"
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="loc-type" required>
                Location Type
              </ModalFieldLabel>
              <Select
                id="loc-type"
                options={locationTypeOptions}
                value={locationType}
                onChange={setLocationType}
                className={modalFieldCls}
              />
            </div>
            <div className="sm:col-span-2">
              <ModalFieldLabel htmlFor="loc-address" required>
                Full Address / Industrial Estate Coordinates
              </ModalFieldLabel>
              <Input
                id="loc-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 24, Phase 3, Industrial Area Sector 82"
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="loc-city" required>
                City
              </ModalFieldLabel>
              <Input
                id="loc-city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={modalFieldCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ModalFieldLabel htmlFor="loc-state" required>
                  State
                </ModalFieldLabel>
                <Select
                  id="loc-state"
                  options={stateOptions}
                  value={state}
                  onChange={setState}
                  className={modalFieldCls}
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
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="201301"
                  className={modalFieldCls}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>2. Operations &amp; Shift Windows</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="loc-shift-start">Shift Start Time</ModalFieldLabel>
              <Select
                id="loc-shift-start"
                options={timeOptions}
                value={shiftStart}
                onChange={setShiftStart}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="loc-shift-end">Shift End Time</ModalFieldLabel>
              <Select
                id="loc-shift-end"
                options={timeOptions}
                value={shiftEnd}
                onChange={setShiftEnd}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="loc-timezone" required>
                Standard Timezone
              </ModalFieldLabel>
              <Select
                id="loc-timezone"
                options={timezoneOptions}
                value={timezone}
                onChange={setTimezone}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="loc-occupancy">Max Operator Occupancy</ModalFieldLabel>
              <Input
                id="loc-occupancy"
                inputMode="numeric"
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
                placeholder="e.g. 1200 Workers"
                className={modalFieldCls}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>3. Biometric Edge Devices</ModalSectionLabel>
            <div className="space-y-2.5">
              {deviceOptions.map((device) => {
                const selected = deviceId === device.id;
                return (
                  <button
                    key={device.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDeviceId(device.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                      selected
                        ? "border-cta bg-info-bg/50 shadow-sm"
                        : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted"
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
          </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
              <ModalSectionLabel className="mb-0">4. Geofencing Boundary</ModalSectionLabel>
              <span className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-success">Active</span>
                <Switch checked={geofenceActive} onChange={setGeofenceActive} size="sm" />
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <ModalFieldLabel htmlFor="loc-radius">Geofence GPS Radius</ModalFieldLabel>
                <Input
                  id="loc-radius"
                  inputMode="numeric"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="150 meters"
                  className={modalFieldCls}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-lat">Latitude</ModalFieldLabel>
                <Input
                  id="loc-lat"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className={modalFieldCls}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="loc-lng">Longitude</ModalFieldLabel>
                <Input
                  id="loc-lng"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className={modalFieldCls}
                />
              </div>
            </div>
          </section>
      </form>
    </Modal>
  );
}
