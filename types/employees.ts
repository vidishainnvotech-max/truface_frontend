export type EmployeeType = "factory" | "field";
export type VerificationMethod = "face" | "fingerprint" | "rfid";
export type SecurityLevel = "two-factor" | "face" | "face-pin";
export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  location: string;
  employeeType: EmployeeType;
  shiftPattern: string;
  biometrics: { face: boolean; fingerprint: boolean; rfid: boolean };
  securityLevel: SecurityLevel;
  method: VerificationMethod;
  status: EmployeeStatus;
  lastAttendance: string;
}

export interface EmployeeFormValues {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  location: string;
  employeeType: EmployeeType;
  shiftPattern: string;
  biometrics: { face: boolean; fingerprint: boolean; rfid: boolean };
  securityLevel: SecurityLevel;
}

export type AttendanceStatus = "on-time" | "late" | "absent" | "early-departure";

export interface AttendanceLogEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  method: VerificationMethod;
  gate: string;
  status: AttendanceStatus;
}

export interface AssignedLocation {
  name: string;
  type: "Primary" | "Secondary";
  radius: string;
}

export interface CheckInLocation {
  name: string;
  time: string;
  inGeofence: boolean;
}

export interface SystemEvent {
  timestamp: string;
  type: string;
  description: string;
  device: string;
  status: "success" | "failed" | "pending";
}

export interface EmployeeDetails {
  todayVerification: {
    verified: boolean;
    checkIn: string;
    terminal: string;
    method: VerificationMethod;
  };
  recentLogs: AttendanceLogEntry[];
  monthStats: {
    daysPresent: number;
    presentPct: string;
    avgCheckIn: string;
    lateArrivals: number;
    overtimeHours: string;
  };
  attendancePattern: { name: string; value: number }[];
  punctuality: {
    score: number;
    onTime: number;
    late: number;
    halfDay: number;
    absent: number;
  };
  biometrics: {
    face: { enrolled: boolean; enrolledOn: string; accuracy: string; lastScan: string };
    rfid: { assigned: boolean; cardId: string; assignedOn: string; expiry: string; slots: string };
    fingerprints: { count: number; profiles: { label: string; verified: boolean }[] };
  };
  securityScore: number;
  monthSummary: {
    totalScheduled: number;
    presentRate: string;
    absentDays: number;
    lateIncidents: number;
    avgWorkHours: string;
  };
  monthLogs: AttendanceLogEntry[];
  assignedLocations: AssignedLocation[];
  recentCheckIns: CheckInLocation[];
  geofenceAdherence: string;
  violations: number;
  system: {
    lastLogin: string;
    lastLoginSource: string;
    failedAttempts: number;
    profileUpdates: number;
    profileUpdateNote: string;
    accessRequests: number;
  };
  events: SystemEvent[];
}
