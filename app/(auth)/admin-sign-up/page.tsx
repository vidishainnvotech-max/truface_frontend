import type { Metadata } from "next";
import { AuthSplitLayout, SignUpForm } from "@/components/auth";

export const metadata: Metadata = { title: "Admin Sign Up — TruFace" };

export default function AdminSignUpPage() {
  return (
    <AuthSplitLayout
      panelTitle="Consolidate Workforces Globally"
      panelDescription="Manage departments, ranks with automated terminal notifications and audit-ready exports in a few smooth steps. Join the enterprise standard."
    >
      <SignUpForm />
    </AuthSplitLayout>
  );
}
