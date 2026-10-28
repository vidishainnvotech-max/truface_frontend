"use client";

import * as React from "react";
import { BadgeCheck, CreditCard, Fingerprint, ScanFace, Trash2 } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Avatar } from "@/components/ui/Avatar";
import type { Employee, EmployeeDetails } from "@/types/employees";

export interface VerificationSetupTabProps {
  employee: Employee;
  details: EmployeeDetails;
}

export function VerificationSetupTab({ employee, details }: VerificationSetupTabProps) {
  const { biometrics } = details;
  const [faceEnabled, setFaceEnabled] = React.useState(true);
  const [secondaryMethod, setSecondaryMethod] = React.useState("rfid-fingerprint");
  const [twoFactor, setTwoFactor] = React.useState(true);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Face Recognition */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <ScanFace className="h-4 w-4 text-cta" />
                Face Recognition Scan Profile
              </span>
            }
            action={
              <Badge tone="success" variant="soft" dot>
                Actively Monitoring
              </Badge>
            }
          />
          <div className="flex gap-4">
            <Avatar name={employee.fullName} size="lg" shape="square" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-xs text-foreground-muted">Enrolled on</p>
              <p className="text-sm font-semibold text-foreground">{biometrics.face.enrolledOn}</p>
              <p className="flex items-center gap-1 text-xs text-success">
                <BadgeCheck className="h-3.5 w-3.5" />
                Face model matches bio-metric marker for {biometrics.face.accuracy} accuracy
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">Enroll Fingerprint</Button>
            <Button variant="secondary" size="sm">
              View Face Vector Logs
            </Button>
          </div>
        </Card>

        {/* RFID Smartcard */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-cta" />
                RFID Access Smartcard
              </span>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Card Assigned</p>
              <p className="mt-1 font-mono text-sm font-semibold text-foreground">{biometrics.rfid.cardId}</p>
              <p className="mt-0.5 text-xs text-foreground-muted">Assigned on {biometrics.rfid.assignedOn}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">RFID Expiry</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{biometrics.rfid.expiry}</p>
              <div className="mt-0.5">
                <Badge tone="success" variant="soft">
                  Status Active
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} className="border-danger text-danger hover:border-danger hover:bg-danger-bg active:border-danger active:bg-danger-bg active:text-danger">
              Revoke Smartcard
            </Button>
          </div>
        </Card>

        {/* Fingerprint Profiles */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-cta" />
                Fingerprint Enrolment Profiles
              </span>
            }
            action={
              <Badge tone="info" variant="soft">
                {biometrics.fingerprints.count} Fingers Enrolled
              </Badge>
            }
          />
          <ul className="space-y-3">
            {biometrics.fingerprints.profiles.map((profile) => (
              <li key={profile.label} className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
                <span className="text-[13px] font-semibold text-foreground">{profile.label}</span>
                {profile.verified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Status
                  </span>
                ) : (
                  <Badge tone="warning" variant="soft">
                    Pending
                  </Badge>
                )}
              </li>
            ))}
            {biometrics.fingerprints.profiles.length === 0 && (
              <li className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-foreground-muted">
                No fingerprints enrolled yet.
              </li>
            )}
          </ul>
          <div className="mt-4">
            <Button variant="secondary" size="sm" leftIcon={<Fingerprint className="h-4 w-4" />}>
              Enroll New Finger
            </Button>
          </div>
        </Card>

        {/* Verification Preferences */}
        <Card>
          <CardHeader title="Verification Preferences" />
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Active Methods</p>
              <div className="mt-2.5 space-y-3">
                <Checkbox
                  label="Face Recognition"
                  checked={faceEnabled}
                  onChange={setFaceEnabled}
                />
                <div className="flex items-center gap-3">
                  <div className="w-56">
                    <Select
                      options={[
                        { label: "RFID + Fingerprint", value: "rfid-fingerprint" },
                        { label: "RFID Only", value: "rfid" },
                        { label: "Fingerprint Only", value: "fingerprint" },
                      ]}
                      value={secondaryMethod}
                      onChange={setSecondaryMethod}
                      selectSize="sm"
                      aria-label="Secondary verification method"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Two-Factor Data Verification</p>
                <p className="mt-0.5 text-xs text-foreground-muted">
                  Requires two successful scans for critical operations
                </p>
              </div>
              <Switch checked={twoFactor} onChange={setTwoFactor} size="sm" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
