"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Clock,
  CreditCard,
  Fingerprint,
  MapPin,
  MonitorOff,
  Plus,
  ScanFace,
  Search,
  ShieldAlert,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button, IconButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { DonutChart } from "@/components/charts";
import {
  QuickAddEmployeeModal,
  QuickAddLocationModal,
  QuickGenerateReportModal,
} from "@/components/features/dashboard";
import { cn } from "@/lib/utils";

type QuickModalKey = "employee" | "location" | "report";

const quickActions: Array<
  | { label: string; icon: typeof Plus; primary: boolean; modal: QuickModalKey }
  | { label: string; icon: typeof Plus; primary: boolean; href: string }
> = [
  { label: "Add Employee", icon: Plus, primary: true, modal: "employee" },
  { label: "Add Location", icon: Plus, primary: true, modal: "location" },
  { label: "View Attendance", icon: Search, primary: false, href: "/attendance" },
  { label: "Generate Report", icon: CalendarDays, primary: false, modal: "report" },
];

const activity = [
  { tone: "bg-success", text: "New employee onboarded - Priya Sharma", time: "1 min ago" },
  { tone: "bg-danger", text: "Face verification failed - Employee #4021", time: "3 min ago" },
  { tone: "bg-secondary", text: "New location added - Mumbai Branch", time: "5 min ago" },
  { tone: "bg-success", text: "Payroll export completed - Finance Team", time: "12 min ago" },
  { tone: "bg-danger", text: "Suspicious login attempt - Dubai Portal", time: "15 min ago" },
];

const attendanceSplit = [
  { label: "Present", value: "84.7%", width: "84.7%", className: "bg-success" },
  { label: "Late", value: "4.83%", width: "4.83%", className: "bg-warning" },
  { label: "Absent", value: "10.4%", width: "10.4%", className: "bg-danger" },
];

type FeedRow = {
  name: string;
  dept: string;
  location: string;
  method: "face" | "rfid" | "fingerprint";
  time: string;
  status: { label: string; late?: boolean };
};

const feed: FeedRow[] = [
  { name: "Deepak Kumar", dept: "Production", location: "Pune Assembly Line", method: "face", time: "09:14 AM", status: { label: "On Time" } },
  { name: "Jaci Shrestha", dept: "Security", location: "Main Headquarters", method: "rfid", time: "09:12 AM", status: { label: "On Time" } },
  { name: "Priya Yadav", dept: "Production", location: "Pune Assembly Line", method: "face", time: "09:23 AM", status: { label: "Late 12min", late: true } },
  { name: "Varun Singh", dept: "Logistics", location: "Chennai Warehouse", method: "fingerprint", time: "09:34 AM", status: { label: "On Time" } },
  { name: "Sunita Devi", dept: "Operations", location: "Mumbai Central", method: "face", time: "09:05 AM", status: { label: "On Time" } },
  { name: "Arjun Sharma", dept: "Sales", location: "Delhi Field", method: "face", time: "10:02 AM", status: { label: "On Time" } },
];

const methodMeta: Record<FeedRow["method"], { label: string; tone: "info" | "primary" | "success"; icon: React.ReactNode }> = {
  face: { label: "Face Verify", tone: "info", icon: <ScanFace className="h-3 w-3" /> },
  rfid: { label: "RFID Card", tone: "primary", icon: <CreditCard className="h-3 w-3" /> },
  fingerprint: { label: "Fingerprint", tone: "success", icon: <Fingerprint className="h-3 w-3" /> },
};

const methodDistribution = [
  { name: "Face Verify", value: 2100, color: "#2563eb" },
  { name: "RFID / Smartcard", value: 187, color: "#16a34a" },
  { name: "Fingerprint", value: 132, color: "#d97706" },
];

const fieldStats = [
  { label: "On Location", value: 389, className: "bg-success" },
  { label: "Enroute / Commute", value: 32, className: "bg-warning" },
  { label: "Location Pending", value: 24, className: "bg-neutral" },
];

const securityAlerts = [
  { label: "Face Failures", value: 3 },
  { label: "Overdue", value: 2 },
  { label: "Duplicate Punches", value: 1 },
  { label: "Unauthorized Access", value: 1 },
];

function DashboardHeader() {
  return (
    <div className="min-w-0">
      <h1 className="truncate text-lg font-bold leading-tight text-foreground">
        Smart Attendance Control Panel
      </h1>
      <p className="truncate text-xs text-foreground-muted">
        Real-time workforce intelligence across all locations
      </p>
    </div>
  );
}

function HeaderActions() {
  return (
    <>
      <button
        type="button"
        className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-foreground-secondary transition-colors hover:bg-surface-muted sm:inline-flex"
      >
        <CalendarDays className="h-4 w-4 text-cta" />
        Today, 04/03/2024
        <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
      </button>
      <span className="relative">
        <IconButton label="Notifications" variant="ghost" className="border border-border bg-surface">
          <Bell className="h-[18px] w-[18px] text-foreground-secondary" />
        </IconButton>
        <span className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
      </span>
      <Avatar name="Aryan Sharma" size="sm" status="online" />
    </>
  );
}

export default function AdminDashboardPage() {
  const [openModal, setOpenModal] = React.useState<QuickModalKey | null>(null);
  const closeModal = React.useCallback(() => setOpenModal(null), []);

  return (
    <DashboardLayout
      guarded={false}
      header={<DashboardHeader />}
      headerActions={<HeaderActions />}
      width="full"
      className="space-y-5 pb-4"
    >
      {/* Search */}
      <div className="relative">
        <Input
          leftIcon={<Search />}
          rightIcon={
            <kbd className="rounded border border-border bg-surface-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground-muted">
              ⌘ K
            </kbd>
          }
          className="h-11 rounded-lg pl-10 text-sm"
          placeholder="Quick search for employees, locations, reports..."
          aria-label="Search"
        />
      </div>

      {/* Primary stats */}
      <StatGrid cols={4}>
        <StatCard
          label="Total Employees"
          value={2847}
          tone="success"
          icon={<Users />}
          footer={<span className="font-semibold text-success">+142 this month</span>}
        />
        <StatCard
          label="Present Today"
          value={2412}
          tone="success"
          icon={<UserCheck />}
          footer={<span className="font-semibold text-success">84.7% Active</span>}
        />
        <StatCard
          label="Absent Today"
          value={298}
          tone="danger"
          icon={<UserX />}
          footer={<span className="font-semibold text-danger">10.5% of staff</span>}
        />
        <StatCard
          label="Late Today"
          value={137}
          tone="warning"
          icon={<Clock />}
          footer={<span className="font-semibold text-warning">+22 today</span>}
        />
      </StatGrid>

      {/* Secondary stats */}
      <StatGrid cols={4}>
        <StatCard
          label="Total Locations"
          value={486}
          tone="info"
          icon={<MapPin />}
          footer={<span className="font-semibold text-secondary">Active</span>}
        />
        <StatCard
          label="Active Workforces"
          value={2361}
          tone="accent"
          icon={<Briefcase />}
          footer={<span className="font-semibold text-secondary">On shift now</span>}
        />
        <StatCard
          label="Devices Offline (24h)"
          value="23 Devices"
          tone="danger"
          accent
          icon={<MonitorOff />}
        />
        <StatCard
          label="Open Security Incidents (24h)"
          value="8 Incidents"
          tone="danger"
          accent
          icon={<ShieldAlert />}
        />
      </StatGrid>

      {/* Quick actions + activity */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Quick Actions" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                href={"href" in action ? action.href : undefined}
                onClick={"modal" in action ? () => setOpenModal(action.modal) : undefined}
                className={cn(
                  "h-10 w-full rounded-lg text-sm font-semibold",
                  action.primary
                    ? "bg-cta text-white hover:bg-cta-hover active:bg-cta-active"
                    : "border border-border-strong bg-surface text-foreground-secondary hover:bg-surface-muted hover:text-foreground"
                )}
                leftIcon={<action.icon className="h-4 w-4" />}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent System Activity"
            action={
              <Link href="/logs" className="text-xs font-semibold text-cta hover:underline">
                View All
              </Link>
            }
          />
          <ul className="divide-y divide-border">
            {activity.map((item) => (
              <li key={item.text} className="flex items-start gap-3 py-2.5 first:pt-0 last:border-0 last:pb-0">
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", item.tone)} aria-hidden />
                <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-foreground-secondary">
                  {item.text} <span className="text-foreground-muted">• {item.time}</span>
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Attendance status bar */}
      <Card>
        <CardHeader title="Today's Attendance Status" />
        <div className="flex h-5 w-full overflow-hidden rounded-full bg-neutral-bg">
          {attendanceSplit.map((seg) => (
            <div
              key={seg.label}
              className={cn("flex items-center overflow-hidden", seg.className)}
              style={{ width: seg.width }}
              title={`${seg.label} ${seg.value}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          {attendanceSplit.map((seg) => (
            <span key={seg.label} className="inline-flex items-center gap-2 text-xs text-foreground-secondary">
              <span className={cn("h-2.5 w-2.5 rounded-full", seg.className)} aria-hidden />
              <span className="font-medium">{seg.label}</span>
              <span className="font-semibold text-foreground">{seg.value}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* Live feed */}
      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="text-base font-semibold leading-tight text-primary">Live Attendance Feed</h3>
            <p className="mt-0.5 text-sm text-foreground-muted">Employees clocking in/out in real time</p>
          </div>
          <Badge tone="success" variant="soft" dot>
            Auto Refreshing
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Staff</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {feed.map((row) => {
                const method = methodMeta[row.method];
                return (
                  <tr key={row.name} className="transition-colors hover:bg-surface-muted">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.name} size="xs" />
                        <div className="min-w-0 leading-tight">
                          <p className="truncate text-[13px] font-semibold text-foreground">{row.name}</p>
                          <p className="truncate text-[11px] text-foreground-muted">{row.dept}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-foreground-secondary">{row.location}</td>
                    <td className="px-5 py-3">
                      <Badge tone={method.tone} variant="soft" leftIcon={method.icon}>
                        {method.label}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-medium tabular-nums text-foreground">
                      {row.time}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Badge tone={row.status.late ? "warning" : "success"} variant="soft">
                        {row.status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-3 text-xs text-foreground-muted">
          <span>Showing 6 of 2,412 check-ins today</span>
          <Link href="/attendance" className="inline-flex items-center gap-1 font-semibold text-cta hover:underline">
            View All Attendance
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      {/* Bottom widgets */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Attendance Method Distribution" />
          <div className="h-48 w-full">
            <DonutChart
              data={methodDistribution}
              centerValue="2.4k"
              centerLabel="Total Logs"
              thickness={20}
            />
          </div>
          <ul className="mt-4 space-y-2">
            {methodDistribution.map((m) => (
              <li key={m.name} className="flex items-center gap-2 text-xs text-foreground-secondary">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} aria-hidden />
                <span className="flex-1">{m.name}</span>
                <span className="font-semibold text-foreground">
                  {m.value >= 1000 ? `${(m.value / 1000).toFixed(1)}k` : m.value}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Field Workforce Location" />
          <div
            className="relative h-44 overflow-hidden rounded-lg border border-border"
            style={{ background: "linear-gradient(135deg, #e6f2e8 0%, #dcedf7 100%)" }}
            aria-hidden
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(#94a3b833 1px, transparent 1px), linear-gradient(90deg, #94a3b833 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <span className="absolute left-[38%] top-[30%] h-3 w-3 rounded-full bg-cta/80 ring-4 ring-cta/20" />
            <span className="absolute left-[64%] top-[52%] h-3 w-3 rounded-full bg-success/80 ring-4 ring-success/20" />
            <span className="absolute left-[52%] top-[64%] h-3 w-3 rounded-full bg-warning/80 ring-4 ring-warning/20" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <MapPin className="h-8 w-8 fill-danger text-danger drop-shadow" />
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold leading-none text-primary">445</p>
              <p className="mt-1 text-xs text-foreground-muted">Field Employees</p>
            </div>
            <Link href="/locations" className="text-xs font-semibold text-cta hover:underline">
              View Map
            </Link>
          </div>

          <ul className="mt-4 space-y-2">
            {fieldStats.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-xs text-foreground-secondary">
                <span className={cn("h-2.5 w-2.5 rounded-full", s.className)} aria-hidden />
                <span className="flex-1">{s.label}</span>
                <span className="font-semibold text-foreground">{s.value}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Security Alerts" />
          <div className="py-2 text-center">
            <p className="text-5xl font-bold leading-none text-danger">8</p>
            <p className="mt-2 text-xs text-foreground-muted">total alerts today</p>
          </div>
          <ul className="mt-4 space-y-2">
            {securityAlerts.map((alert) => (
              <li
                key={alert.label}
                className="flex items-center justify-between rounded-md bg-danger-bg px-3 py-2 text-xs"
              >
                <span className="inline-flex items-center gap-2 text-foreground-secondary">
                  <ShieldAlert className="h-3.5 w-3.5 text-danger" />
                  {alert.label}
                </span>
                <span className="font-bold text-danger">{alert.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <QuickAddEmployeeModal open={openModal === "employee"} onClose={closeModal} />
      <QuickAddLocationModal open={openModal === "location"} onClose={closeModal} />
      <QuickGenerateReportModal open={openModal === "report"} onClose={closeModal} />
    </DashboardLayout>
  );
}
