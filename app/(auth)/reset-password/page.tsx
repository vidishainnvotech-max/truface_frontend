import type { Metadata } from "next";
import { AuthSplitLayout, ResetPasswordForm } from "@/components/auth";

export const metadata: Metadata = { title: "Reset Password — TruFace" };

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      panelTitle="Configure Credentials"
      panelDescription="Set a strong password to protect your TruFace account. Use a unique phrase that meets all your organizational policy rules."
    >
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}
