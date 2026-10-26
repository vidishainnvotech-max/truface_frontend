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

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-foreground">
      {children} <span className="text-danger">*</span>
    </label>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/admin-dashboard");
  }

  return (
    <div className="w-full">
      <h1 className="text-[26px] font-bold leading-tight text-foreground">Admin Sign Up</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        Create a corporate administrator workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
            <Input
              id="signup-name"
              name="name"
              autoComplete="name"
              required
              placeholder="Aryan Sharma"
              className={authFieldClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="signup-company">Company Name</FieldLabel>
            <Input
              id="signup-company"
              name="company"
              required
              placeholder="TruFace India"
              className={authFieldClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="signup-email">Work Email</FieldLabel>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              className={authFieldClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="signup-phone">Phone Number</FieldLabel>
            <Input
              id="signup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="+1 (555) 019-2834"
              className={authFieldClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="signup-password">Password</FieldLabel>
            <PasswordInput
              id="signup-password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className={authFieldClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="signup-confirm">Confirm Password</FieldLabel>
            <PasswordInput
              id="signup-confirm"
              name="confirmPassword"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className={authFieldClass}
            />
          </div>
        </div>

        <Checkbox
          required
          label={
            <span className="text-[13px] text-foreground-muted">
              I agree to the <span className="font-semibold text-cta">Terms of Service</span> and{" "}
              <span className="font-semibold text-cta">Privacy Policy</span>.
            </span>
          }
        />

        <Button type="submit" className={authButtonClass} loading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-foreground-muted">
        Already have an account?{" "}
        <Link href="/admin-login" className="font-semibold text-cta hover:text-cta-hover hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
