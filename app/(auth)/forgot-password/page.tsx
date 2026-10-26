import type { Metadata } from "next";
import { AuthSplitLayout, ForgotPasswordForm } from "@/components/auth";

export const metadata: Metadata = { title: "Forgot Password — TruFace" };

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout
      panelTitle="Secure Verification Hub"
      panelDescription="Enter your registered workspace credentials to initiate secure password recovery protocols. We'll route a secure verification link to your primary account."
    >
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
