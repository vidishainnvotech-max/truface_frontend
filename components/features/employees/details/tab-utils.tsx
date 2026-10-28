"use client";

import * as React from "react";
import { CreditCard, Fingerprint, ScanFace } from "lucide-react";
import type { Tone } from "@/types/common";
import type { VerificationMethod } from "@/types/employees";

export const methodMeta: Record<VerificationMethod, { label: string; tone: Tone; icon: React.ReactNode }> = {
  face: { label: "Face Recognition", tone: "info", icon: <ScanFace className="h-3 w-3" /> },
  rfid: { label: "RFID Smartcard", tone: "primary", icon: <CreditCard className="h-3 w-3" /> },
  fingerprint: { label: "Fingerprint", tone: "success", icon: <Fingerprint className="h-3 w-3" /> },
};
