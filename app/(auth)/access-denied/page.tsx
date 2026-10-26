import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/auth";

export const metadata: Metadata = { title: "Access Denied — TruFace" };

const currentYear = new Date().getFullYear();

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-elevated">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-danger-bg">
            <ShieldAlert className="h-8 w-8 text-danger" aria-hidden />
          </span>

          <h1 className="mt-5 text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">
            You don&apos;t have permission to access this page or your session has expired. Please
            contact your system administrator.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3">
            <Button
              href="/admin-login"
              className="h-10 w-full rounded-lg bg-cta text-sm font-semibold text-white shadow-sm hover:bg-cta-hover active:bg-cta-active"
            >
              Back to Login
            </Button>
            <Button
              href="mailto:support@truface.com"
              variant="outline"
              className="h-10 w-full rounded-lg border-border-strong text-sm font-semibold text-foreground-secondary hover:border-border-strong hover:bg-surface-muted hover:text-foreground"
            >
              Contact Support
            </Button>
          </div>

          <div className="mt-7 w-full border-t border-border pt-4">
            <BrandLogo className="justify-center" />
            <p className="mt-3 text-[11px] text-foreground-muted">
              © {currentYear} TruFace Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
