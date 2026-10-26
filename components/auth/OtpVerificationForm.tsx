"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { authButtonClass } from "./AuthSplitLayout";

const OTP_LENGTH = 6;
const INITIAL_SECONDS = 4 * 60 + 59;

function formatTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function OtpVerificationForm() {
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = React.useState(INITIAL_SECONDS);
  const [submitting, setSubmitting] = React.useState(false);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  function setDigit(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index: number, raw: string) {
    const value = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, value);
    if (value && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    router.push("/reset-password");
  }

  const complete = digits.every((d) => d !== "");

  return (
    <div className="w-full">
      <h1 className="text-[26px] font-bold leading-tight text-foreground">Verify Your Identity</h1>
      <p className="mt-1.5 text-sm text-foreground-muted">
        A 6-digit passcode has been sent to your registered email.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div className="flex gap-2.5 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "h-12 w-full min-w-0 rounded-lg border bg-surface text-center text-lg font-semibold text-foreground",
                "transition-colors placeholder:text-foreground-muted",
                "focus:border-cta focus-visible:focus-ring",
                digit ? "border-cta" : "border-border-strong"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold tabular-nums text-success">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(seconds)}
          </span>
          <button
            type="button"
            onClick={() => setSeconds(INITIAL_SECONDS)}
            className="text-[13px] font-semibold text-cta hover:text-cta-hover hover:underline"
          >
            Resend Code
          </button>
        </div>

        <Button type="submit" className={authButtonClass} loading={submitting} disabled={!complete}>
          Verify Code
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
