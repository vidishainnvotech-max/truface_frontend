"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Cloud, Fingerprint, ScanFace } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AttendancePageTitle, AttendanceHeaderActions, AttendanceGlobalSearch } from "./attendance-page-chrome";
import type { AttendanceDetails } from "@/types/attendance";

export interface AttendanceDetailsPanelProps {
  details: AttendanceDetails;
}

function LifecycleTimeline({ steps }: { steps: AttendanceDetails["lifecycle"] }) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-foreground-muted">No hardware sync events recorded for this entry.</p>
    );
  }

  return (
    <ol className="relative space-y-6 pl-1">
      <span className="absolute bottom-3 left-[7px] top-3 w-px bg-border" aria-hidden />
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-4">
          <span
            className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-surface ${
              step.tone === "success" ? "bg-success" : "bg-cta"
            }`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
              <Badge tone={step.tone === "success" ? "success" : "info"} variant="soft" size="sm">
                Step {i + 1}
              </Badge>
            </div>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
              {step.timestamp} • {step.device}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground-secondary">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function PunchField({ label, value, tone }: { label: string; value: string; tone?: "success" | "info" | "warning" }) {
  return (
    <div className="rounded-lg bg-surface-muted px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          tone === "success"
            ? "text-success"
            : tone === "info"
              ? "text-secondary"
              : tone === "warning"
                ? "text-warning"
                : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function AttendanceDetailsPanel({ details }: AttendanceDetailsPanelProps) {
  const { record, profile, punch, lifecycle } = details;

  return (
    <DashboardLayout
      guarded={false}
      breadcrumbs={[
        { label: "Attendance", href: "/attendance" },
        { label: "Attendance Details" },
      ]}
      header={
        <AttendancePageTitle
          title="Attendance Details"
          subtitle="Detailed IoT scan log and network synchronization verification"
        />
      }
      headerActions={<AttendanceHeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      <AttendanceGlobalSearch />

      <nav aria-label="Record breadcrumb" className="flex items-center gap-1.5 text-xs text-foreground-muted">
        <Link href="/attendance" className="hover:text-secondary">
          Attendance
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href="/attendance/records" className="hover:text-secondary">
          Records
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="font-semibold text-foreground">Record {record.id}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: profile + punch info */}
        <div className="space-y-5">
          <Card>
            <div className="flex items-start gap-4">
              <Avatar name={record.employeeName} size="lg" status="online" />
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground">{record.employeeName}</h2>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  ID: {record.employeeId} • {record.department}
                </p>
                <div className="mt-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-foreground-muted">Employment Type</span>
                    <span className="font-semibold text-foreground">{profile.employmentType}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-foreground-muted">Supervisor</span>
                    <span className="font-semibold text-foreground">{profile.supervisor}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-foreground-muted">Line Segment Assignment</span>
                    <span className="font-semibold text-foreground">{profile.lineSegment}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center gap-2">
              <ScanFace className="h-4 w-4 text-cta" />
              <h3 className="text-base font-semibold leading-tight text-primary">Punch Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <PunchField label="Date" value={punch.date} />
              <PunchField label="Check-In" value={punch.checkIn} />
              <PunchField label="Check-Out" value={punch.checkOut} />
              <PunchField label="Total Duration" value={punch.totalDuration} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <PunchField label="Method" value={punch.method} />
              <PunchField
                label="Verification"
                value={punch.verification}
                tone={punch.verification.startsWith("Verified") ? "success" : "warning"}
              />
              <PunchField
                label="Sync Status"
                value={punch.sync}
                tone={punch.sync === "Cloud Synced" ? "info" : "warning"}
              />
            </div>
          </Card>
        </div>

        {/* Right: IoT lifecycle */}
        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Cloud className="h-4 w-4 text-secondary" />
            <h3 className="text-base font-semibold leading-tight text-primary">IoT Hardware Sync Lifecycle</h3>
          </div>
          <LifecycleTimeline steps={lifecycle} />
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/attendance/records" className="text-xs font-semibold text-cta hover:underline">
          ← Back to Attendance Records
        </Link>
        <span className="text-xs text-foreground-muted">•</span>
        <Link href="/attendance/live" className="text-xs font-semibold text-cta hover:underline">
          Live Monitoring Terminal
        </Link>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-foreground-muted">
          <Fingerprint className="h-3.5 w-3.5" />
          Record verified with SHA-256 fingerprint matching {record.employeeId}
        </span>
      </div>
    </DashboardLayout>
  );
}
