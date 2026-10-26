import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------- FormField ---------------- */
export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Inline layout: label left, control right. */
  inline?: boolean;
}

export function FormField({ label, htmlFor, required, hint, error, children, className, inline }: FormFieldProps) {
  return (
    <div className={cn(inline ? "grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start" : "space-y-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-foreground", inline && "sm:pt-2.5")}>
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}
      <div className={cn(inline && "sm:col-span-2", "space-y-1.5")}>
        {children}
        {error ? (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-foreground-muted">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- FormActions ---------------- */
export function FormActions({ children, className, sticky }: React.PropsWithChildren<{ className?: string; sticky?: boolean }>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2",
        sticky && "sticky bottom-0 -mx-6 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}


