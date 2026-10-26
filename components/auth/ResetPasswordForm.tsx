"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Eye, EyeOff, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, type InputProps } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { authButtonClass, authFieldClass } from "./AuthSplitLayout";

function PasswordInput(props: InputProps) {
  const [visible, setVisible] = React.useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="cursor-pointer text-foreground-muted transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      }
    />
  );
}

const rules: Array<{ label: string; test: (v: string) => boolean }> = [
  { label: "At least 8 characters long", test: (v) => v.length >= 8 },
  { label: "Contains uppercase and lowercase letters", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "Contains at least one number (0-9)", test: (v) => /\d/.test(v) },
  { label: "Contains at least one special character (!@#$)", test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const allValid = rules.every((r) => r.test(password));
  const matches = confirm.length > 0 && password === confirm;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allValid) {
      setError("Your password does not meet all the requirements below.");
      return;
    }
    if (!matches) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    router.push("/admin-login");
  }

  return (
    <div className="w-full">
      <h1 className="text-[26px] font-bold leading-tight text-foreground">Create New Password</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Your new password must be different from previously used passwords.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="reset-password" className="mb-1.5 block text-xs font-semibold text-foreground">
            New Password <span className="text-danger">*</span>
          </label>
          <PasswordInput
            id="reset-password"
            name="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authFieldClass}
          />
        </div>

        <div>
          <label htmlFor="reset-confirm" className="mb-1.5 block text-xs font-semibold text-foreground">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <PasswordInput
            id="reset-confirm"
            name="confirmPassword"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(authFieldClass, confirm.length > 0 && !matches && "border-danger focus:border-danger")}
          />
          {confirm.length > 0 && !matches && (
            <p className="mt-1.5 text-xs text-danger">Passwords do not match.</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
            Password Requirements
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {rules.map((rule) => {
              const met = rule.test(password);
              return (
                <li key={rule.label} className="flex items-center gap-2 text-xs">
                  {met ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                  ) : password.length > 0 ? (
                    <XCircle className="h-3.5 w-3.5 shrink-0 text-danger" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-foreground-muted" />
                  )}
                  <span className={met ? "text-success" : "text-foreground-muted"}>{rule.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-danger">
            <XCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}

        <Button type="submit" className={authButtonClass} loading={submitting}>
          Reset Password
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
