"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/components/ui/Toast";
import { ModalFieldLabel } from "@/components/features/dashboard/quick-modal-ui";
import { getGeofenceSettings } from "@/lib/mock-locations";
import { cn } from "@/lib/utils";
import type { GeofenceSettings, LocationListItem } from "@/types/locations";

export interface GeofenceTabProps {
  location: LocationListItem;
}

export function GeofenceTab({ location }: GeofenceTabProps) {
  const toast = useToast();
  const initial = React.useMemo(() => getGeofenceSettings(), []);
  const [settings, setSettings] = React.useState<GeofenceSettings>(initial);
  const [saving, setSaving] = React.useState(false);

  const radiusPct = Math.min(100, Math.max(5, (settings.radiusM / 1000) * 100));

  const handleSave = async () => {
    setSaving(true);
    try {
      toast.success(`Geofence for "${location.name}" saved`);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setSettings(initial);
    toast.info("Geofence changes discarded");
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Visual boundary */}
      <Card padding="none" className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cta" aria-hidden />
            <h3 className="text-sm font-bold text-foreground">Visual Geofence Boundary</h3>
          </div>
          <Badge tone="success" variant="soft">
            Locked GPS Fixed
          </Badge>
        </div>

        <div className="relative m-4 h-[340px] overflow-hidden rounded-lg bg-surface-muted">
          {/* grid lines */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* fence circle */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cta/70 bg-cta/10"
            style={{
              width: `${Math.min(280, 100 + radiusPct * 1.8)}px`,
              height: `${Math.min(280, 100 + radiusPct * 1.8)}px`,
            }}
          />
          {/* pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto mb-1 rounded bg-foreground px-2 py-0.5 text-[10px] font-semibold text-white shadow">
              {location.name.split(" ").slice(0, 2).join(" ")} Core
            </div>
            <div className="mx-auto h-4 w-4 rounded-full border-2 border-white bg-danger shadow" />
          </div>
          <div className="absolute bottom-3 left-3 rounded bg-foreground/80 px-2 py-1 text-[10px] font-medium text-white">
            Radius constraint scale: {settings.radiusM}m
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <h3 className="mb-5 text-base font-semibold text-foreground">Geofence Settings</h3>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="fence-radius"
                className="block text-[10px] font-semibold uppercase tracking-wider text-foreground-muted"
              >
                Fence Radius
              </label>
              <span className="text-xs font-bold text-cta">{settings.radiusM} Meters</span>
            </div>
            <input
              id="fence-radius"
              type="range"
              min={50}
              max={1000}
              step={10}
              value={settings.radiusM}
              onChange={(e) => setSettings((s) => ({ ...s, radiusM: Number(e.target.value) }))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-cta"
              aria-label="Fence radius"
            />
          </div>

          <div>
            <ModalFieldLabel htmlFor="fence-lat">Latitude Coordinates</ModalFieldLabel>
            <Input
              id="fence-lat"
              value={`${settings.latitude.toFixed(4)}° N`}
              readOnly
              className="bg-surface-muted"
            />
          </div>

          <div>
            <ModalFieldLabel htmlFor="fence-lng">Longitude Coordinates</ModalFieldLabel>
            <Input
              id="fence-lng"
              value={`${settings.longitude.toFixed(4)}° E`}
              readOnly
              className="bg-surface-muted"
            />
          </div>

          <div>
            <ModalFieldLabel>Boundary Enforce Status</ModalFieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, enforced: true }))}
                className={cn(
                  "h-9 rounded-md border text-xs font-semibold transition-colors",
                  settings.enforced
                    ? "border-success bg-success-bg text-success"
                    : "border-border bg-surface text-foreground-secondary hover:border-border-strong"
                )}
              >
                Enforced
              </button>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, enforced: false }))}
                className={cn(
                  "h-9 rounded-md border text-xs font-semibold transition-colors",
                  !settings.enforced
                    ? "border-border-strong bg-surface-muted text-foreground"
                    : "border-border bg-surface text-foreground-secondary hover:border-border-strong"
                )}
              >
                Disabled
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-muted p-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Fake GPS Spoof Lock</p>
              <p className="text-xs text-foreground-muted">Reject mocked satellite feeds instantly</p>
            </div>
            <Switch
              checked={settings.spoofLock}
              onChange={(v) => setSettings((s) => ({ ...s, spoofLock: v }))}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-4">
            <Button variant="secondary" onClick={handleDiscard} disabled={saving} className="min-w-40">
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              className="min-w-40 bg-cta text-white hover:bg-cta-hover active:bg-cta-active"
            >
              Save Geofence
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
