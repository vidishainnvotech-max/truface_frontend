import { CreditCard, Fingerprint, MapPin, ScanFace } from "lucide-react";
import type { Tone } from "@/types/common";
import type { AttendanceAuthMethod, AttendanceVerification, CloudSyncState } from "@/types/attendance";

export const methodMeta: Record<
  AttendanceAuthMethod,
  { label: string; tone: Tone; icon: React.ReactNode }
> = {
  face: { label: "Face Verify", tone: "info", icon: <ScanFace className="h-3 w-3" /> },
  rfid: { label: "RFID Card", tone: "primary", icon: <CreditCard className="h-3 w-3" /> },
  fingerprint: { label: "Fingerprint", tone: "success", icon: <Fingerprint className="h-3 w-3" /> },
  gps: { label: "GPS Check", tone: "accent", icon: <MapPin className="h-3 w-3" /> },
  none: { label: "None", tone: "neutral", icon: null },
};

export const verificationMeta: Record<
  AttendanceVerification,
  { label: string; tone: Tone }
> = {
  "on-time": { label: "On Time", tone: "success" },
  "late-entry": { label: "Late Entry", tone: "warning" },
  absent: { label: "Absent", tone: "danger" },
  failed: { label: "Failed", tone: "danger" },
};

export const syncMeta: Record<CloudSyncState, { label: string; tone: Tone }> = {
  synced: { label: "Synced", tone: "info" },
  pending: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
};
