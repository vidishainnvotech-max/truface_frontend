"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, type InputProps } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
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

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/admin-dashboard");
  }

  return (
    <div className="w-full">
      <h1 className="text-[26px] font-bold leading-tight text-foreground">Admin Login</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Secure credential access to HR operations console.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-foreground">
            Email or Employee ID <span className="text-danger">*</span>
          </label>
          <Input
            id="login-email"
            name="email"
            type="text"
            autoComplete="username"
            required
            placeholder="admin@yourcompany.com"
            className={authFieldClass}
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-foreground">
            Password <span className="text-danger">*</span>
          </label>
          <PasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={authFieldClass}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Checkbox label="Remember Me" className="text-sm" />
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-cta hover:text-cta-hover hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className={authButtonClass} loading={submitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-foreground-muted">
        Are you an employee?{" "}
        <Link href="/admin-sign-up" className="font-semibold text-cta hover:text-cta-hover hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
