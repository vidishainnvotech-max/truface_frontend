"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  ModalFieldLabel,
  ModalSectionLabel,
  SegmentedControl,
  modalFieldCls,
} from "@/components/features/dashboard/quick-modal-ui";
import {
  departmentOptions,
  locationOptions,
  securityLevelOptions,
  shiftOptions,
} from "@/config/employee-options";
import type { Employee, EmployeeFormValues, SecurityLevel } from "@/types/employees";

export interface EmployeeFormProps {
  mode: "create" | "edit";
  employee?: Employee;
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

type Errors = Partial<Record<keyof EmployeeFormValues, string>>;

function employeeToFormValues(e: Employee): EmployeeFormValues {
  return {
    fullName: e.fullName,
    email: e.email,
    phone: e.phone,
    department: e.department,
    designation: e.designation,
    joiningDate: e.joiningDate,
    location: e.location,
    employeeType: e.employeeType,
    shiftPattern: e.shiftPattern,
    biometrics: { ...e.biometrics },
    securityLevel: e.securityLevel,
  };
}

const emptyValues: EmployeeFormValues = {
  fullName: "",
  email: "",
  phone: "",
  department: "operations",
  designation: "",
  joiningDate: "2024-10-24",
  location: "pune-assembly",
  employeeType: "factory",
  shiftPattern: "general",
  biometrics: { face: true, fingerprint: true, rfid: false },
  securityLevel: "two-factor",
};

function validate(v: EmployeeFormValues): Errors {
  const e: Errors = {};
  if (!v.fullName.trim()) e.fullName = "Full name is required.";
  if (!v.email.trim()) e.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.phone.trim()) e.phone = "Phone number is required.";
  return e;
}

export function EmployeeForm({ mode, employee, onSubmit, onCancel }: EmployeeFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = React.useState<EmployeeFormValues>(
    mode === "edit" && employee ? employeeToFormValues(employee) : emptyValues
  );
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = React.useState(false);
  const [deactivating, setDeactivating] = React.useState(false);

  const set = <K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...values,
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      });
      toast.success(mode === "create" ? "Employee created successfully" : "Employee updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = onCancel ?? (() => router.push("/employees"));

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      toast.success(`Employee "${employee?.fullName}" deactivated`);
      setConfirmDeactivate(false);
      router.push("/employees");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card padding="lg">
        <div className="space-y-8">
          <section>
            <ModalSectionLabel>Basic Information</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <ModalFieldLabel htmlFor="emp-id">Employee ID</ModalFieldLabel>
                <Input
                  id="emp-id"
                  value={mode === "edit" && employee ? employee.id : "Auto-generated (e.g. TF-2024-0991)"}
                  readOnly
                  disabled
                  className={`${modalFieldCls} bg-surface-muted text-foreground-muted`}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-name" required>
                  Full Name
                </ModalFieldLabel>
                <Input
                  id="emp-name"
                  required
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="e.g. Ramesh Deshmukh"
                  invalid={Boolean(errors.fullName)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
                {errors.fullName && <p role="alert" className="mt-1 text-xs text-danger">{errors.fullName}</p>}
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-email" required>
                  Email Address
                </ModalFieldLabel>
                <Input
                  id="emp-email"
                  type="email"
                  required
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="e.g. name@truface.in"
                  invalid={Boolean(errors.email)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
                {errors.email && <p role="alert" className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-phone" required>
                  Phone Number
                </ModalFieldLabel>
                <Input
                  id="emp-phone"
                  type="tel"
                  required
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  invalid={Boolean(errors.phone)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
                {errors.phone && <p role="alert" className="mt-1 text-xs text-danger">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section>
            <ModalSectionLabel>Employment Details</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <ModalFieldLabel htmlFor="emp-department">Department</ModalFieldLabel>
                <Select
                  id="emp-department"
                  options={departmentOptions}
                  value={values.department}
                  onChange={(v) => set("department", v)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-designation">Designation</ModalFieldLabel>
                <Input
                  id="emp-designation"
                  value={values.designation}
                  onChange={(e) => set("designation", e.target.value)}
                  placeholder="e.g. Senior Plant Inspector"
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-joining">Joining Date</ModalFieldLabel>
                <Input
                  id="emp-joining"
                  type="date"
                  value={values.joiningDate}
                  onChange={(e) => set("joiningDate", e.target.value)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
            </div>
          </section>

          <section>
            <ModalSectionLabel>Assignment &amp; Deployment</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <ModalFieldLabel htmlFor="emp-location">Primary Location</ModalFieldLabel>
                <Select
                  id="emp-location"
                  options={locationOptions}
                  value={values.location}
                  onChange={(v) => set("location", v)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
              <div>
                <ModalFieldLabel>Employee Type</ModalFieldLabel>
                <SegmentedControl
                  value={values.employeeType}
                  onChange={(v) => set("employeeType", v)}
                  ariaLabel="Employee type"
                  options={[
                    { value: "factory", label: "Factory" },
                    { value: "field", label: "Field" },
                  ]}
                />
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-shift">Shift Pattern</ModalFieldLabel>
                <Select
                  id="emp-shift"
                  options={shiftOptions}
                  value={values.shiftPattern}
                  onChange={(v) => set("shiftPattern", v)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
            </div>
          </section>

          <section>
            <ModalSectionLabel>Attendance Security Configuration</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <ModalFieldLabel>Allowed Verification Methods</ModalFieldLabel>
                <div className="space-y-2.5 pt-1">
                  <Checkbox
                    label="Face Recognition"
                    checked={values.biometrics.face}
                    disabled={submitting}
                    onChange={(checked) => set("biometrics", { ...values.biometrics, face: checked })}
                  />
                  <Checkbox
                    label="Fingerprint Scan"
                    checked={values.biometrics.fingerprint}
                    disabled={submitting}
                    onChange={(checked) => set("biometrics", { ...values.biometrics, fingerprint: checked })}
                  />
                  <Checkbox
                    label="RFID Smartcard"
                    checked={values.biometrics.rfid}
                    disabled={submitting}
                    onChange={(checked) => set("biometrics", { ...values.biometrics, rfid: checked })}
                  />
                </div>
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-security-level">Security Verification Level</ModalFieldLabel>
                <Select<SecurityLevel>
                  id="emp-security-level"
                  options={securityLevelOptions}
                  value={values.securityLevel}
                  onChange={(v) => set("securityLevel", v)}
                  disabled={submitting}
                  className={modalFieldCls}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <div className="hidden flex-1 sm:block" />
          <Button variant="ghost" onClick={cancel} disabled={submitting || deactivating}>
            Cancel
          </Button>
          {mode === "edit" && (
            <Button
              variant="outline"
              className="border-danger text-danger hover:border-danger hover:bg-danger-bg active:border-danger active:bg-danger-bg active:text-danger"
              onClick={() => setConfirmDeactivate(true)}
              disabled={submitting || deactivating}
            >
              Deactivate Employee
            </Button>
          )}
          <Button
            type="submit"
            loading={submitting}
            className="bg-cta text-white hover:bg-cta-hover active:bg-cta-active"
          >
            {mode === "create" ? "Save Employee" : "Update Employee"}
          </Button>
        </div>
      </Card>

      {mode === "edit" && employee && (
        <ConfirmDialog
          open={confirmDeactivate}
          onClose={() => setConfirmDeactivate(false)}
          onConfirm={handleDeactivate}
          loading={deactivating}
          tone="danger"
          title={`Deactivate ${employee.fullName}?`}
          description="The employee will no longer be able to check in or use biometric verification. You can reactivate them later from the employees list."
          confirmLabel="Deactivate employee"
        />
      )}
    </form>
  );
}
