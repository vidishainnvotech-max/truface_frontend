"use client";

import * as React from "react";
import { Building2, MapPin, Navigation } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Employee, EmployeeDetails } from "@/types/employees";

export interface LocationMapTabProps {
  employee: Employee;
  details: EmployeeDetails;
}

export function LocationMapTab({ details }: LocationMapTabProps) {
  const { assignedLocations, recentCheckIns, geofenceAdherence, violations } = details;
  const primary = assignedLocations[0];

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Map */}
      <Card className="lg:col-span-3">
        <CardHeader
          title={
            <span className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-cta" />
              {primary?.name ?? "Location"} — Live Geofence Mapping
            </span>
          }
          action={
            <Badge tone="success" variant="soft">
              Geofence Compliance
            </Badge>
          }
        />
        <div
          className="relative h-[380px] overflow-hidden rounded-lg border border-border"
          style={{ background: "linear-gradient(135deg, #e8f1fb 0%, #eef3f8 50%, #e6eef8 100%)" }}
          aria-label="Geofence map placeholder"
        >
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "linear-gradient(#94a3b833 1px, transparent 1px), linear-gradient(90deg, #94a3b833 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
            aria-hidden
          />

          {/* Geofence circle */}
          <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-cta/50 bg-cta/5" aria-hidden />

          {/* Location pin */}
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-1">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cta text-white shadow-md">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <span className="rounded bg-surface px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
                {primary?.name ?? "Location"}
              </span>
            </div>
          </div>

          {/* Employee current position */}
          <div className="absolute left-[58%] top-[58%] -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-1">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-success text-white shadow-md ring-4 ring-success/20">
                <Navigation className="h-4 w-4" />
              </span>
              <span className="rounded bg-surface px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
                Aarav Mehta (Current)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Right column */}
      <div className="space-y-5 lg:col-span-2">
        {/* Assigned Locations */}
        <Card>
          <CardHeader title="Assigned Locations" />
          <ul className="space-y-3">
            {assignedLocations.map((loc) => (
              <li key={loc.name} className="flex items-start gap-3 rounded-lg border border-border px-4 py-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-info-bg text-secondary">
                  <Building2 className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-foreground">{loc.name}</p>
                  <p className="text-[11px] text-foreground-muted">
                    {loc.type} • Geofence Radius: {loc.radius}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Compliance Statistics */}
        <Card>
          <CardHeader title="Compliance Statistics" />
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Geofence Adherence</p>
              <p className="mt-1 text-3xl font-bold text-success">{geofenceAdherence}</p>
            </div>
            <Badge tone="success" variant="soft">
              {violations} Violations
            </Badge>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              Recent Check-In Locations (Last 5)
            </p>
            <ul className="mt-3 space-y-2.5">
              {recentCheckIns.map((checkIn, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={cn("text-[13px] font-semibold", checkIn.inGeofence ? "text-foreground" : "text-warning")}>
                      {checkIn.name}
                    </p>
                    <p className="text-[11px] text-foreground-muted">{checkIn.time}</p>
                  </div>
                  <Badge tone={checkIn.inGeofence ? "success" : "warning"} variant="soft" className="shrink-0">
                    {checkIn.inGeofence ? "In Geofence" : "Ad-hoc Visit"}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
