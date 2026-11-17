import type {
  AttendanceDetails,
  AttendanceLifecycleStep,
  AttendanceRecord,
  AttendanceTodayLog,
  LiveAttendanceEntry,
} from "@/types/attendance";

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "TF-1002",
    employeeId: "TF-1002",
    employeeName: "Rajesh Kumar",
    department: "Tech Ops",
    date: "24 Oct 24",
    checkIn: "09:15 AM",
    checkOut: "06:15 PM",
    duration: "9h 00m",
    location: "Pune Line A",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-1183",
    employeeId: "TF-1183",
    employeeName: "Priya Patel",
    department: "Quality QA",
    date: "24 Oct 24",
    checkIn: "09:32 AM",
    checkOut: "06:30 PM",
    duration: "8h 58m",
    location: "Pune Line B",
    method: "face",
    verification: "late-entry",
    sync: "synced",
  },
  {
    id: "TF-1204",
    employeeId: "TF-1204",
    employeeName: "Amit Sharma",
    department: "Operations",
    date: "24 Oct 24",
    checkIn: "09:05 AM",
    checkOut: "06:21 PM",
    duration: "9h 16m",
    location: "Mumbai HQ",
    method: "rfid",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-3021",
    employeeId: "TF-3021",
    employeeName: "Vikram Singh",
    department: "Logistics",
    date: "24 Oct 24",
    checkIn: "09:41 AM",
    checkOut: "06:45 PM",
    duration: "9h 04m",
    location: "Chennai Whse",
    method: "fingerprint",
    verification: "late-entry",
    sync: "pending",
  },
  {
    id: "TF-2210",
    employeeId: "TF-2210",
    employeeName: "Sunita Rao",
    department: "Management",
    date: "24 Oct 24",
    checkIn: "08:55 AM",
    checkOut: "05:00 PM",
    duration: "8h 05m",
    location: "Mumbai HQ",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-1155",
    employeeId: "TF-1155",
    employeeName: "Aarav Mehta",
    department: "Tech Ops",
    date: "24 Oct 24",
    checkIn: "09:02 AM",
    checkOut: "06:05 PM",
    duration: "9h 03m",
    location: "Pune Line A",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-0186",
    employeeId: "TF-0186",
    employeeName: "Ananya Iyer",
    department: "Quality QA",
    date: "24 Oct 24",
    checkIn: "09:48 AM",
    checkOut: "06:12 PM",
    duration: "8h 24m",
    location: "Chennai Whse",
    method: "rfid",
    verification: "late-entry",
    sync: "synced",
  },
  {
    id: "TF-4104",
    employeeId: "TF-4104",
    employeeName: "Rohan Das",
    department: "Operations",
    date: "24 Oct 24",
    checkIn: "09:12 AM",
    checkOut: "06:00 PM",
    duration: "8h 48m",
    location: "Pune Line B",
    method: "fingerprint",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-1092",
    employeeId: "TF-1092",
    employeeName: "Deepika Sen",
    department: "Logistics",
    date: "24 Oct 24",
    checkIn: "---",
    checkOut: "---",
    duration: "—",
    location: "Chennai Whse",
    method: "none",
    verification: "absent",
    sync: "failed",
  },
  {
    id: "TF-3012",
    employeeId: "TF-3012",
    employeeName: "Kunal Shah",
    department: "Tech Ops",
    date: "24 Oct 24",
    checkIn: "09:04 AM",
    checkOut: "06:10 PM",
    duration: "9h 06m",
    location: "Pune Line A",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-1042",
    employeeId: "TF-1042",
    employeeName: "Rahul Sharma",
    department: "Tech Ops",
    date: "24 Oct 24",
    checkIn: "08:42 AM",
    checkOut: "05:38 PM",
    duration: "8h 56m",
    location: "Pune Line A",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "TF-0882",
    employeeId: "TF-0882",
    employeeName: "Neha Deshmukh",
    department: "Security",
    date: "24 Oct 24",
    checkIn: "09:18 AM",
    checkOut: "06:02 PM",
    duration: "8h 44m",
    location: "Pune Line A",
    method: "face",
    verification: "on-time",
    sync: "synced",
  },
];

export const mockLiveFeed: LiveAttendanceEntry[] = [
  {
    id: "live-1",
    employeeId: "TF-1002",
    employeeName: "Rajesh Kumar",
    department: "Tech Ops",
    location: "Pune Assembly Line",
    method: "face",
    timestamp: "10:14:02 AM",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "live-2",
    employeeId: "TF-1183",
    employeeName: "Priya Patel",
    department: "Finance QA",
    location: "Pune Assembly Line",
    method: "face",
    timestamp: "10:12:45 AM",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "live-3",
    employeeId: "TF-2204",
    employeeName: "Amit Sharma",
    department: "Operations",
    location: "Mumbai HQ Gate A",
    method: "rfid",
    timestamp: "10:11:15 AM",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "live-4",
    employeeId: "TF-2210",
    employeeName: "Sunita Rao",
    department: "Management",
    location: "Mumbai HQ Gate B",
    method: "face",
    timestamp: "10:08:23 AM",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "live-5",
    employeeId: "TF-3021",
    employeeName: "Vikram Singh",
    department: "Logistics",
    location: "Chennai Warehouse",
    method: "fingerprint",
    timestamp: "10:05:12 AM",
    verification: "late-entry",
    sync: "synced",
  },
  {
    id: "live-6",
    employeeId: "TF-0882",
    employeeName: "Neha Deshmukh",
    department: "Security",
    location: "Pune Assembly Line",
    method: "face",
    timestamp: "10:03:55 AM",
    verification: "on-time",
    sync: "synced",
  },
  {
    id: "live-7",
    employeeId: "TF-4104",
    employeeName: "Rohan Das",
    department: "Field Ops",
    location: "Outstation Pune",
    method: "gps",
    timestamp: "10:01:08 AM",
    verification: "on-time",
    sync: "pending",
  },
  {
    id: "live-8",
    employeeId: "TF-1102",
    employeeName: "Anjali Gupta",
    department: "Packaging",
    location: "Chennai Warehouse",
    method: "fingerprint",
    timestamp: "09:59:44 AM",
    verification: "late-entry",
    sync: "synced",
  },
];

export const mockTodayAttendanceLog: AttendanceTodayLog[] = [
  { time: "08:02", employeeName: "Arjun Sharma", department: "Production", method: "face", status: "success" },
  { time: "08:05", employeeName: "Priya Nair", department: "Quality", method: "rfid", status: "success" },
  { time: "08:09", employeeName: "Rohan Mehta", department: "Maintenance", method: "fingerprint", status: "success" },
  { time: "08:12", employeeName: "Sana Khan", department: "HR", method: "face", status: "failed" },
  { time: "08:15", employeeName: "Amit Patel", department: "Field Staff", method: "rfid", status: "success" },
];

export const mockWeeklyAttendanceRate = [
  { day: "Mon", rate: 81.2 },
  { day: "Tue", rate: 83.5 },
  { day: "Wed", rate: 86.1 },
  { day: "Thu", rate: 84.8 },
  { day: "Fri", rate: 85.4 },
  { day: "Sat", rate: 82.6 },
  { day: "Sun", rate: 76.9 },
];

export const mockAuthMethodShare = [
  { label: "RFID Smartcard", value: 45, color: "#2563eb" },
  { label: "Face ID Scan", value: 38, color: "#16a34a" },
  { label: "Fingerprint Scanner", value: 17, color: "#d97706" },
];

const lifecycleFor = (
  checkIn: string,
  method: AttendanceRecord["method"],
  employeeId: string
): AttendanceLifecycleStep[] => {
  const [hm, period] = checkIn.split(" ");
  const [hRaw, mRaw, sRaw] = (hm.includes(":") ? hm : `${hm}:00:00`).split(":");
  const h = hRaw.padStart(2, "0");
  const m = mRaw ?? "00";
  const s = sRaw ?? "00";
  const t = (offset: number) => {
    const total = Number(s) + offset;
    const mm = String(Number(m) + Math.floor(total / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${h}:${mm}:${ss} ${period}`;
  };

  const methodStep: AttendanceLifecycleStep =
    method === "rfid"
      ? {
          title: "RFID Proximity Card Scan",
          timestamp: t(0),
          device: "Factory Gate QF Device",
          description: `Card verified in local cache: ${employeeId} registered.`,
          tone: "success",
        }
      : method === "fingerprint"
        ? {
            title: "Fingerprint Capacitor Scan",
            timestamp: t(0),
            device: "Biometric Terminal V3",
            description: `Minutiae template matched for ${employeeId} at 99.12% similarity.`,
            tone: "success",
          }
        : {
            title: "RFID Proximity Card Scan",
            timestamp: t(0),
            device: "Factory Gate QF Device",
            description: `Card verified in local cache: ${employeeId} registered.`,
            tone: "success",
          };

  return [
    methodStep,
    {
      title: "Edge Face Detection Triggered",
      timestamp: t(2),
      device: "1080p Smart IR Camera",
      description: "High accuracy bounding box matched over 12 landmark anchors.",
      tone: "success",
    },
    {
      title: "Anti-Spoofing Liveness Passed",
      timestamp: t(3),
      device: "AI Edge Model V2",
      description: "Depth map and blink analysis calculated score of 0.992 (legit).",
      tone: "success",
    },
    {
      title: "Identity Matched in Core DB",
      timestamp: t(4),
      device: "Local Face Vector Match",
      description: "Database matched photo vector with 99.85% confidence score.",
      tone: "success",
    },
    {
      title: "Attendance Cloud Log Sync",
      timestamp: t(5),
      device: "AWS IoT Core Bridge",
      description: `Data pack securely written with SHA-256 fingerprint matching ${employeeId}.`,
      tone: "info",
    },
  ];
};

const methodDisplay: Record<AttendanceRecord["method"], string> = {
  face: "Face Recognition",
  rfid: "RFID Card",
  fingerprint: "Fingerprint Scan",
  gps: "GPS Geo-Check",
  none: "None",
};

export function getAttendanceRecord(id: string): AttendanceDetails | null {
  const record = mockAttendanceRecords.find(
    (r) => r.id.toLowerCase() === id.toLowerCase() || r.employeeId.toLowerCase() === id.toLowerCase()
  );
  if (!record) return null;

  const isRahul = record.employeeId === "TF-1042";

  return {
    record,
    profile: {
      employmentType: "Permanent • Full Time",
      supervisor: "Manoj Dev (IDTF-08)",
      lineSegment: isRahul ? "Pune Assembly Line #04" : `${record.location} #04`,
    },
    punch: {
      date: isRahul ? "24 Oct 2024" : "24 Oct 2024",
      checkIn: record.checkIn,
      checkOut: isRahul ? "17:38 PM" : record.checkOut,
      totalDuration: record.duration,
      method: methodDisplay[record.method],
      verification:
        record.verification === "on-time"
          ? "Verified (Passed)"
          : record.verification === "late-entry"
            ? "Verified (Late)"
            : "Not Verified",
      sync:
        record.sync === "synced" ? "Cloud Synced" : record.sync === "pending" ? "Sync Pending" : "Sync Failed",
    },
    lifecycle: record.method === "none" ? [] : lifecycleFor(record.checkIn, record.method, record.employeeId),
  };
}

export function getAttendanceRecordIds(): string[] {
  return mockAttendanceRecords.map((r) => r.id);
}
