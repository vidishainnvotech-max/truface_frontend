"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { PageHeader, ConnectionBadge } from "@/components/common";
import { SettingsSectionNav } from "./SettingsSectionNav";

export interface SettingsShellProps {
  children: React.ReactNode;
}

/** Shared layout for all settings pages: header + section nav + content. */
export function SettingsShell({ children }: SettingsShellProps) {
  return (
    <DashboardLayout breadcrumbs={[{ label: "Settings" }]}>
      <PageHeader
        title="Platform Command Configurations"
        description="Control SaaS environment parameters, rate-limits, and multi-tenant isolation."
        actions={<ConnectionBadge name="Primary Server" state="connected" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <SettingsSectionNav />
        <div className="min-w-0">{children}</div>
      </div>
    </DashboardLayout>
  );
}
