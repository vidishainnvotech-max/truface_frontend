import type { VerificationMethod } from "./employees";

export type AttendanceAuthMethod = VerificationMethod | "gps" | "none";
export type AttendanceVerification = "on-time" | "late-entry" | "absent" | "failed";
export type CloudSyncState = "synced" | "pending" | "failed";
export type WorkforceSegment = "factory" | "field";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  location: string;
  method: AttendanceAuthMethod;
  verification: AttendanceVerification;
  sync: CloudSyncState;
}

export interface LiveAttendanceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  location: string;
  method: AttendanceAuthMethod;
  timestamp: string;
  verification: "on-time" | "late-entry";
  sync: CloudSyncState;
}

export interface AttendanceTodayLog {
  time: string;
  employeeName: string;
  department: string;
  method: AttendanceAuthMethod;
  status: "success" | "failed";
}

export interface AttendanceLifecycleStep {
  title: string;
  timestamp: string;
  device: string;
  description: string;
  tone: "success" | "info";
}

export interface AttendancePunchInfo {
  date: string;
  checkIn: string;
  checkOut: string;
  totalDuration: string;
  method: string;
  verification: string;
  sync: string;
}

export interface AttendanceProfile {
  employmentType: string;
  supervisor: string;
  lineSegment: string;
}

export interface AttendanceDetails {
  record: AttendanceRecord;
  profile: AttendanceProfile;
  punch: AttendancePunchInfo;
  lifecycle: AttendanceLifecycleStep[];
}
