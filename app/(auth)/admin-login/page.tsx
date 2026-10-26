import type { Metadata } from "next";
import { AuthSplitLayout, LoginForm } from "@/components/auth";

export const metadata: Metadata = { title: "Admin Login — TruFace" };

export default function AdminLoginPage() {
  return (
    <AuthSplitLayout
      panelTitle="Enterprise Attendance Control Center"
      panelDescription="Real-time shift matching, roster planning, and seamless notifications — refined with advanced tools to optimize organization workflows."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
