"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FilterSelect } from "@/components/common/FilterSelect";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  LocationsPageTitle,
  LocationsHeaderActions,
  LocationsGlobalSearch,
} from "./locations-page-chrome";
import { getFieldAgents } from "@/lib/mock-locations";
import { cn } from "@/lib/utils";
import type { LocationListItem } from "@/types/locations";

export interface LocationTrackingPanelProps {
  location: LocationListItem;
}

const hubOptions = [
  { label: "Pune Zone", value: "pune" },
  { label: "Mumbai Zone", value: "mumbai" },
  { label: "Chennai Zone", value: "chennai" },
];

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Within Geofence", value: "within" },
  { label: "Outside Geofence", value: "outside" },
];

export function LocationTrackingPanel({ location }: LocationTrackingPanelProps) {
  const agents = React.useMemo(() => getFieldAgents(), []);
  const [search, setSearch] = React.useState("");
  const [hub, setHub] = React.useState("pune");
  const [status, setStatus] = React.useState("all");
  const [selectedId, setSelectedId] = React.useState(agents[0]?.id ?? "");

  const filtered = agents.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchQ = !q || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    const matchStatus =
      status === "all" || (status === "within" && a.within) || (status === "outside" && !a.within);
    return matchQ && matchStatus;
  });

  const selected = agents.find((a) => a.id === selectedId) ?? agents[0];

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[
        { label: "Locations", href: "/locations" },
        { label: location.name, href: `/locations/${location.id}` },
        { label: "Live Tracking" },
      ]}
      header={
        <LocationsPageTitle
          title="Operative GIS Tracking"
          subtitle="Geofenced perimeter surveillance for field operatives and logistics teams"
        />
      }
      headerActions={<LocationsHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <LocationsGlobalSearch />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Map canvas */}
        <Card padding="none" className="relative min-h-[520px] overflow-hidden bg-[#0f1419] p-0">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 40% 45%, #1a2332 0%, #0f1419 55%, #0a0e13 100%)",
            }}
          />
          {/* faux satellite blocks */}
          <div aria-hidden className="absolute inset-0 opacity-40">
            <div className="absolute left-[12%] top-[18%] h-24 w-32 rounded-sm bg-[#1e2a38]" />
            <div className="absolute left-[30%] top-[30%] h-16 w-24 rounded-sm bg-[#243040]" />
            <div className="absolute left-[55%] top-[22%] h-28 w-20 rounded-sm bg-[#1a2533]" />
            <div className="absolute left-[48%] top-[55%] h-20 w-36 rounded-sm bg-[#222e3d]" />
            <div className="absolute left-[20%] top-[60%] h-16 w-28 rounded-sm bg-[#1c2735]" />
            <div className="absolute left-[70%] top-[48%] h-24 w-24 rounded-sm bg-[#202b3a]" />
          </div>

          {/* geofence rings */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/80"
            style={{ width: 340, height: 340, boxShadow: "0 0 24px rgba(34,211,238,0.25)" }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-300/50"
            style={{ width: 220, height: 220 }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/70 bg-emerald-500/15"
          />
          {/* secondary markers */}
          <div aria-hidden className="absolute left-[28%] top-[32%] h-12 w-12 rounded-full border border-cyan-400/50" />
          <div aria-hidden className="absolute left-[62%] top-[38%] h-10 w-10 rounded-full border border-cyan-400/50" />
          <div aria-hidden className="absolute left-[35%] top-[62%] h-14 w-14 rounded-full border border-cyan-400/40" />

          {/* active agent pin */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto mb-1 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-white/20">
              {selected ? `${selected.name.split(" ")[0]} D. (Active)` : "Agent (Active)"}
            </div>
            <div className="mx-auto h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow" />
          </div>

          {/* zoom controls */}
          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-md border border-white/20 bg-black/50">
            <button type="button" aria-label="Zoom in" className="px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
              +
            </button>
            <button type="button" aria-label="Zoom out" className="border-t border-white/20 px-3 py-2 text-sm font-bold text-white hover:bg-white/10">
              −
            </button>
          </div>
        </Card>

        {/* Side panel */}
        <div className="flex flex-col gap-4">
          <Card className="space-y-3">
            <div className="relative">
              <Input
                leftIcon={<Search />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search active field agents"
                className="h-9 pl-9 text-sm"
                aria-label="Search active field agents"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterSelect label="Hub" value={hub} onChange={setHub} options={hubOptions} />
              <FilterSelect label="Status" value={status} onChange={setStatus} options={statusOptions} />
            </div>
          </Card>

          <Card padding="none" className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                Field Employees ({filtered.length})
              </p>
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((agent) => {
                const active = agent.id === selected?.id;
                return (
                  <li key={agent.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(agent.id)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                        active ? "bg-info-bg/40" : "hover:bg-surface-muted"
                      )}
                    >
                      <Avatar name={agent.name} size="sm" status={agent.within ? "online" : "offline"} />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[13px] font-semibold text-foreground">{agent.name}</span>
                          <span className="shrink-0 text-[11px] text-foreground-muted">{agent.lastSeen}</span>
                        </span>
                        <span className="block truncate text-[11px] text-foreground-muted">{agent.distance}</span>
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          agent.within ? "bg-success" : "bg-danger"
                        )}
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-xs text-foreground-muted">No agents match your filters.</li>
              )}
            </ul>
          </Card>

          {selected && (
            <Card>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                Selected Operative Target
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={selected.name} size="md" status={selected.within ? "online" : "offline"} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-bold text-foreground">{selected.name}</p>
                  <p className="truncate text-[11px] text-foreground-muted">
                    {selected.id} • {selected.role}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Battery</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{selected.battery}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">GPS Accuracy</p>
                  <p className="mt-1 text-sm font-bold text-success">{selected.gpsAccuracy}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Status</p>
                  <p className="mt-1">
                    <Badge tone={selected.within ? "success" : "danger"} variant="text">
                      {selected.within ? "In Geofence" : "Outside"}
                    </Badge>
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
