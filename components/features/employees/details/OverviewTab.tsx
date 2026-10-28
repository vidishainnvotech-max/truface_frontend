"use client";

import * as React from "react";
import { BadgeCheck, Clock, CreditCard, Fingerprint, ScanFace, TriangleAlert } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard, StatGrid } from "@/components/common/StatCard";
import { DonutChart, LineChart } from "@/components/charts";
import { BiometricRadar } from "./BiometricRadar";
import { methodMeta } from "./tab-utils";
import type { Employee, EmployeeDetails } from "@/types/employees";

export interface OverviewTabProps {
  employee: Employee;
  details: EmployeeDetails;
}

export function OverviewTab({ details }: OverviewTabProps) {
  const { todayVerification, recentLogs, monthStats, attendancePattern, punctuality, biometrics, securityScore } = details;

  return (
    <div className="space-y-5">
      {/* Today's Verification Status */}
      <Card>
        <CardHeader
          title="Today's Verification Status"
          action={
            <Badge tone={todayVerification.verified ? "success" : "danger"} variant="soft" dot>
              {todayVerification.verified ? "Verified Access" : "Not Verified"}
            </Badge>
          }
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Biometric Check-In</p>
            <p className="mt-1 text-lg font-bold text-foreground">{todayVerification.checkIn}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Terminal Location</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{todayVerification.terminal}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Biometric Method</p>
            <div className="mt-1">
              <Badge tone={methodMeta[todayVerification.method].tone} variant="soft" leftIcon={methodMeta[todayVerification.method].icon}>
                {methodMeta[todayVerification.method].label}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Attendance Logs */}
      <Card padding="none">
        <div className="px-5 pt-5">
          <CardHeader title="Recent Attendance Logs (This Month)" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-border bg-row-alt text-[11px] uppercase tracking-wider text-subheading">
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Check-In</th>
                <th className="px-5 py-3 font-semibold">Check-Out</th>
                <th className="px-5 py-3 font-semibold">Verification Method</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentLogs.map((log) => (
                <tr key={log.date} className="transition-colors hover:bg-surface-muted">
                  <td className="px-5 py-3 text-[13px] font-medium text-foreground">{log.date}</td>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{log.checkIn}</td>
                  <td className="px-5 py-3 text-[13px] tabular-nums text-foreground-secondary">{log.checkOut}</td>
                  <td className="px-5 py-3">
                    <Badge tone={methodMeta[log.method].tone} variant="soft" leftIcon={methodMeta[log.method].icon}>
                      {methodMeta[log.method].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={log.status === "on-time" ? "success" : "warning"} variant="soft">
                      {log.status === "on-time" ? "On Time" : "Late Arrival"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats row */}
      <StatGrid cols={4}>
        <StatCard
          label="Days Present"
          value={monthStats.daysPresent}
          tone="success"
          icon={<BadgeCheck />}
          footer={<span className="font-semibold text-success">{monthStats.presentPct}</span>}
        />
        <StatCard
          label="Average Check-In"
          value={monthStats.avgCheckIn}
          tone="info"
          icon={<Clock />}
        />
        <StatCard
          label="Late Arrivals"
          value={monthStats.lateArrivals}
          tone="warning"
          icon={<TriangleAlert />}
          footer={<span className="font-semibold text-warning">this month</span>}
        />
        <StatCard
          label="Overtime Hours"
          value={monthStats.overtimeHours}
          tone="accent"
          icon={<Clock />}
        />
      </StatGrid>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Attendance Pattern"
            action={
              <Badge tone="info" variant="soft">
                Last 30 Days
              </Badge>
            }
          />
          <div className="h-56 w-full">
            <LineChart
              data={attendancePattern}
              series={[{ key: "value", label: "Attendance", color: "#2563eb" }]}
              xKey="name"
              area
              showDots
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Punctuality Score" />
          <div className="flex items-center gap-6">
            <div className="h-44 w-44 shrink-0">
              <DonutChart
                data={[
                  { name: "On Time", value: punctuality.onTime, color: "#2563eb" },
                  { name: "Late", value: punctuality.late, color: "#f59e0b" },
                  { name: "Half Day", value: punctuality.halfDay, color: "#f97316" },
                  { name: "Absent", value: punctuality.absent, color: "#dc2626" },
                ]}
                centerValue={`${punctuality.score}%`}
                centerLabel="On Time"
                thickness={22}
              />
            </div>
            <ul className="min-w-0 flex-1 space-y-2.5">
              {[
                { label: "On Time", value: punctuality.onTime, color: "#2563eb" },
                { label: "Late", value: punctuality.late, color: "#f59e0b" },
                { label: "Half Day", value: punctuality.halfDay, color: "#f97316" },
                { label: "Absent", value: punctuality.absent, color: "#dc2626" },
              ].map((row) => (
                <li key={row.label} className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} aria-hidden />
                  <span className="flex-1">{row.label}</span>
                  <span className="font-semibold text-foreground">{row.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* Biometrics + Security */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Biometric Usage Analysis" />
          <div className="h-56 w-full">
            <BiometricRadar />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Security Overview"
            action={
              <Badge tone={securityScore >= 80 ? "success" : "warning"} variant="soft">
                {securityScore}% Secure
              </Badge>
            }
          />
          <ul className="space-y-3">
            <li className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-info-bg text-secondary">
                <ScanFace className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-foreground">Face Scan Profile</p>
                <p className="text-[11px] text-foreground-muted">{biometrics.face.enrolled ? "Enrolled" : "Not Enrolled"}</p>
              </div>
              {biometrics.face.enrolled ? (
                <BadgeCheck className="h-5 w-5 shrink-0 text-success" />
              ) : (
                <TriangleAlert className="h-5 w-5 shrink-0 text-warning" />
              )}
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-success-bg text-success">
                <Fingerprint className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-foreground">Fingerprint ID</p>
                <p className="text-[11px] text-foreground-muted">{biometrics.fingerprints.count > 0 ? "Enrolled" : "Not Enrolled"}</p>
              </div>
              {biometrics.fingerprints.count > 0 ? (
                <BadgeCheck className="h-5 w-5 shrink-0 text-success" />
              ) : (
                <TriangleAlert className="h-5 w-5 shrink-0 text-warning" />
              )}
            </li>
            <li className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-warning-bg text-warning">
                <CreditCard className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-foreground">RFID Smartcard</p>
                <p className="text-[11px] text-foreground-muted">{biometrics.rfid.assigned ? "Active" : "Not Assigned"}</p>
              </div>
              <span className="text-xs font-bold text-warning">{biometrics.rfid.slots}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
