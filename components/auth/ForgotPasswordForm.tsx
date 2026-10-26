"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authButtonClass, authFieldClass } from "./AuthSplitLayout";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/otp-verification");
  }

  return (
    <div className="w-full">
      <h1 className="text-[26px] font-bold leading-tight text-foreground">Forgot Password?</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Enter your registered email or employee ID to reset your password.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold text-foreground">
            Email or Employee ID <span className="text-danger">*</span>
          </label>
          <Input
            id="forgot-email"
            name="email"
            type="text"
            autoComplete="username"
            required
            placeholder="admin@yourcompany.name"
            className={authFieldClass}
          />
        </div>

        <Button type="submit" className={authButtonClass} loading={submitting}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/admin-login"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cta hover:text-cta-hover hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Login
        </Link>
      </p>
    </div>
  );
}
