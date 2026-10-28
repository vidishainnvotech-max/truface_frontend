"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  ModalFieldLabel,
  ModalSectionLabel,
  SegmentedControl,
  QuickModalFooter,
  modalFieldCls,
} from "./quick-modal-ui";

const FORM_ID = "quick-add-employee";

const departmentOptions = [
  { value: "operations", label: "Operations" },
  { value: "production", label: "Production" },
  { value: "logistics", label: "Logistics" },
  { value: "security", label: "Security" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
];

const locationOptions = [
  { value: "mumbai", label: "Mumbai Plant" },
  { value: "pune", label: "Pune Assembly Line" },
  { value: "noida", label: "Noida Plant" },
  { value: "chennai", label: "Chennai Warehouse" },
  { value: "delhi", label: "Delhi Field Office" },
];

const shiftOptions = [
  { value: "general", label: "General Shift (09:00 AM - 05:30 PM)" },
  { value: "early", label: "Early Shift (06:00 AM - 02:00 PM)" },
  { value: "late", label: "Late Shift (02:00 PM - 10:00 PM)" },
  { value: "night", label: "Night Shift (10:00 PM - 06:00 AM)" },
];

const securityLevelOptions = [
  { value: "two-factor", label: "Two Factor: Face + Fingerprint" },
  { value: "face", label: "Face Only" },
  { value: "face-pin", label: "Face + Employee PIN" },
];

export interface QuickAddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickAddEmployeeModal({ open, onClose }: QuickAddEmployeeModalProps) {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [department, setDepartment] = React.useState("operations");
  const [designation, setDesignation] = React.useState("");
  const [joiningDate, setJoiningDate] = React.useState("2024-10-24");
  const [primaryLocation, setPrimaryLocation] = React.useState("mumbai");
  const [shiftPattern, setShiftPattern] = React.useState("general");
  const [employeeType, setEmployeeType] = React.useState<"factory" | "field">("factory");
  const [biometrics, setBiometrics] = React.useState({ face: true, fingerprint: true, rfid: false });
  const [securityLevel, setSecurityLevel] = React.useState("two-factor");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-cta" aria-hidden />
          Quick Add Employee
        </span>
      }
      footer={
        <QuickModalFooter
          formId={FORM_ID}
          actionLabel="Add Employee"
        />
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-6">
        <section>
          <ModalSectionLabel>Basic Information</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="emp-id">Employee ID</ModalFieldLabel>
              <Input
                id="emp-id"
                value="Auto-generated (e.g. TF-2024-0991)"
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Deshmukh"
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="emp-email" required>
                Email Address
              </ModalFieldLabel>
              <Input
                id="emp-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@truface.in"
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="emp-phone" required>
                Phone Number
              </ModalFieldLabel>
              <Input
                id="emp-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className={modalFieldCls}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Employment Details</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="emp-department">Department</ModalFieldLabel>
              <Select
                id="emp-department"
                options={departmentOptions}
                value={department}
                onChange={setDepartment}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="emp-designation">Designation</ModalFieldLabel>
              <Input
                id="emp-designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Plant Inspector"
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="emp-joining">Joining Date</ModalFieldLabel>
              <Input
                id="emp-joining"
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className={modalFieldCls}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Assignment &amp; Deployment</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="emp-location">Primary Location</ModalFieldLabel>
              <Select
                id="emp-location"
                options={locationOptions}
                value={primaryLocation}
                onChange={setPrimaryLocation}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="emp-shift">Shift Pattern</ModalFieldLabel>
              <Select
                id="emp-shift"
                options={shiftOptions}
                value={shiftPattern}
                onChange={setShiftPattern}
                className={modalFieldCls}
              />
            </div>
            <div className="sm:col-span-2">
              <ModalFieldLabel>Employee Type</ModalFieldLabel>
              <SegmentedControl
                value={employeeType}
                onChange={setEmployeeType}
                ariaLabel="Employee type"
                className="sm:max-w-xs"
                options={[
                  { value: "factory", label: "Factory" },
                  { value: "field", label: "Field" },
                ]}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Attendance Security Configuration</ModalSectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <ModalFieldLabel>Enabled Biometric Methods</ModalFieldLabel>
                <div className="space-y-2 pt-1">
                  <Checkbox
                    label="Face Recognition"
                    checked={biometrics.face}
                    onChange={(checked) => setBiometrics((b) => ({ ...b, face: checked }))}
                  />
                  <Checkbox
                    label="Fingerprint Scan"
                    checked={biometrics.fingerprint}
                    onChange={(checked) => setBiometrics((b) => ({ ...b, fingerprint: checked }))}
                  />
                  <Checkbox
                    label="RFID Smartcard"
                    checked={biometrics.rfid}
                    onChange={(checked) => setBiometrics((b) => ({ ...b, rfid: checked }))}
                  />
                </div>
              </div>
              <div>
                <ModalFieldLabel htmlFor="emp-security-level">Security Verification Level</ModalFieldLabel>
                <Select
                  id="emp-security-level"
                  options={securityLevelOptions}
                  value={securityLevel}
                  onChange={setSecurityLevel}
                  className={modalFieldCls}
                />
              </div>
            </div>
          </section>
      </form>
    </Modal>
  );
}
