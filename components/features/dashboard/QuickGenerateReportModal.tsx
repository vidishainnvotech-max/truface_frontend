"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import {
  ModalFieldLabel,
  ModalSectionLabel,
  SegmentedControl,
  QuickModalFooter,
  modalFieldCls,
} from "./quick-modal-ui";

const FORM_ID = "quick-generate-report";

const reportTypeOptions = [
  { value: "daily", label: "Daily Report" },
  { value: "weekly", label: "Weekly Report" },
  { value: "monthly", label: "Monthly Report" },
  { value: "payroll", label: "Payroll Summary" },
];

const departmentOptions = [
  { value: "all", label: "All Departments" },
  { value: "operations", label: "Operations" },
  { value: "production", label: "Production" },
  { value: "logistics", label: "Logistics" },
  { value: "security", label: "Security" },
];

const locationOptions = [
  { value: "all", label: "All Locations" },
  { value: "mumbai", label: "Mumbai Plant" },
  { value: "pune", label: "Pune Assembly Line" },
  { value: "noida", label: "Noida Plant" },
  { value: "chennai", label: "Chennai Warehouse" },
];

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "leave", label: "On Leave" },
];

const contentOptions = [
  { key: "summary", label: "Attendance Summary", defaultChecked: true },
  { key: "late", label: "Late Arrivals & Early Departures", defaultChecked: true },
  { key: "times", label: "Check-In/Check-Out Times", defaultChecked: true },
  { key: "overtime", label: "Overtime Hours", defaultChecked: false },
  { key: "methods", label: "Verification Methods", defaultChecked: true },
  { key: "location", label: "Location Tracking Data", defaultChecked: false },
] as const;

type ContentKey = (typeof contentOptions)[number]["key"];

export interface QuickGenerateReportModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickGenerateReportModal({ open, onClose }: QuickGenerateReportModalProps) {
  const [reportType, setReportType] = React.useState("daily");
  const [fromDate, setFromDate] = React.useState("2024-10-01");
  const [toDate, setToDate] = React.useState("2024-10-24");
  const [department, setDepartment] = React.useState("all");
  const [location, setLocation] = React.useState("all");
  const [employeeType, setEmployeeType] = React.useState<"all" | "factory" | "field">("all");
  const [status, setStatus] = React.useState("all");
  const [content, setContent] = React.useState<Record<ContentKey, boolean>>({
    summary: true,
    late: true,
    times: true,
    overtime: false,
    methods: true,
    location: false,
  });
  const [format, setFormat] = React.useState<"pdf" | "excel" | "csv">("pdf");
  const [includeCharts, setIncludeCharts] = React.useState(true);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onClose();
  }

  const leftContent = contentOptions.filter((_, i) => i % 2 === 0);
  const rightContent = contentOptions.filter((_, i) => i % 2 === 1);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="h-4 w-1 rounded-full bg-cta" aria-hidden />
          Quick Generate Report
        </span>
      }
      footer={
        <QuickModalFooter
          formId={FORM_ID}
          actionLabel="Generate Report"
        />
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="space-y-6">
        <section>
          <ModalSectionLabel>Report Type &amp; Date</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <ModalFieldLabel htmlFor="rep-type">Report Type</ModalFieldLabel>
              <Select
                id="rep-type"
                options={reportTypeOptions}
                value={reportType}
                onChange={setReportType}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="rep-from">From Date</ModalFieldLabel>
              <Input
                id="rep-from"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="rep-to">To Date</ModalFieldLabel>
              <Input
                id="rep-to"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={modalFieldCls}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Filters</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel htmlFor="rep-department">Department</ModalFieldLabel>
              <Select
                id="rep-department"
                options={departmentOptions}
                value={department}
                onChange={setDepartment}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="rep-location">Location</ModalFieldLabel>
              <Select
                id="rep-location"
                options={locationOptions}
                value={location}
                onChange={setLocation}
                className={modalFieldCls}
              />
            </div>
            <div>
              <ModalFieldLabel>Employee Type</ModalFieldLabel>
              <SegmentedControl
                value={employeeType}
                onChange={setEmployeeType}
                ariaLabel="Employee type"
                options={[
                  { value: "all", label: "All" },
                  { value: "factory", label: "Factory" },
                  { value: "field", label: "Field" },
                ]}
              />
            </div>
            <div>
              <ModalFieldLabel htmlFor="rep-status">Status</ModalFieldLabel>
              <Select
                id="rep-status"
                options={statusOptions}
                value={status}
                onChange={setStatus}
                className={modalFieldCls}
              />
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Report Content</ModalSectionLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-2.5">
              {leftContent.map((option) => (
                <Checkbox
                  key={option.key}
                  label={option.label}
                  checked={content[option.key]}
                  onChange={(checked) => setContent((c) => ({ ...c, [option.key]: checked }))}
                />
              ))}
            </div>
            <div className="space-y-2.5">
              {rightContent.map((option) => (
                <Checkbox
                  key={option.key}
                  label={option.label}
                  checked={content[option.key]}
                  onChange={(checked) => setContent((c) => ({ ...c, [option.key]: checked }))}
                />
              ))}
            </div>
          </div>
        </section>

        <section>
          <ModalSectionLabel>Export Options</ModalSectionLabel>
          <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
            <div>
              <ModalFieldLabel>Format</ModalFieldLabel>
              <SegmentedControl
                value={format}
                onChange={setFormat}
                ariaLabel="Export format"
                options={[
                  { value: "pdf", label: "PDF" },
                  { value: "excel", label: "Excel" },
                  { value: "csv", label: "CSV" },
                ]}
              />
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-6">
              <div>
                <ModalFieldLabel>Visualization</ModalFieldLabel>
                <span className="block text-sm font-medium text-foreground">Include Charts</span>
              </div>
              <span className="pb-4 sm:pb-0">
                <Switch checked={includeCharts} onChange={setIncludeCharts} size="sm" />
              </span>
            </div>
          </div>
        </section>
      </form>
    </Modal>
  );
}
