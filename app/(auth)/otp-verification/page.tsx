import type { Metadata } from "next";
import { AuthSplitLayout, OtpVerificationForm } from "@/components/auth";

export const metadata: Metadata = { title: "OTP Verification — TruFace" };

export default function OtpVerificationPage() {
  return (
    <AuthSplitLayout
      panelTitle="Instant Identity Verification"
      panelDescription="A one-time passcode ensures only you can access the platform. Check your workspace authenticator app or email for codes."
    >
      <OtpVerificationForm />
    </AuthSplitLayout>
  );
}
