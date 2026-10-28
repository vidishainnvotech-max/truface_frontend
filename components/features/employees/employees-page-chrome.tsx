"use client";

import * as React from "react";
import { Bell, CalendarDays, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

/** Page title block passed to DashboardLayout `header`. */
export function EmployeesPageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="min-w-0">
      <h1 className="truncate text-lg font-bold leading-tight text-foreground">{title}</h1>
      <p className="truncate text-xs text-foreground-muted">{subtitle}</p>
    </div>
  );
}

/** Date pill + notifications + avatar, matching the dashboard header actions. */
export function EmployeesHeaderActions() {
  return (
    <>
      <button
        type="button"
        className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-foreground-secondary transition-colors hover:bg-surface-muted sm:inline-flex"
      >
        <CalendarDays className="h-4 w-4 text-cta" />
        Today, 24 Oct, 2024
        <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
      </button>
      <span className="relative">
        <IconButton label="Notifications" variant="ghost" className="border border-border bg-surface">
          <Bell className="h-[18px] w-[18px] text-foreground-secondary" />
        </IconButton>
        <span className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
      </span>
      <Avatar name="Ajay Sharma" size="sm" status="online" />
    </>
  );
}

/** Global ⌘K search bar shown below the header on employee pages. */
export function EmployeesGlobalSearch() {
  return (
    <div className="relative">
      <Input
        leftIcon={<Search />}
        rightIcon={
          <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground-muted">
            ⌘ K
          </kbd>
        }
        className="h-11 rounded-lg pl-10 text-sm"
        placeholder="Global Search — employees, locations, logs..."
        aria-label="Global search"
      />
    </div>
  );
}
