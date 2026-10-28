"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/** Compact field height shared by the quick-add modals. */
export const modalFieldCls = "h-9 rounded-md";

/** Blue uppercase section heading (e.g. "BASIC INFORMATION", "1. BASIC LOCATION INFORMATION"). */
export function ModalSectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-cta", className)}>
      {children}
    </p>
  );
}

/** Small uppercase gray field label with optional required marker. */
export function ModalFieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-foreground-muted"
    >
      {children}
      {required && <span className="text-danger"> *</span>}
    </label>
  );
}

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

/** Pill segmented control (Employee Type, Export Format...). */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("inline-flex h-9 w-full rounded-md border border-border bg-surface-muted p-0.5", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 rounded text-xs font-semibold transition-colors",
            value === option.value
              ? "bg-cta text-white shadow-sm"
              : "text-foreground-secondary hover:bg-surface hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Full-width submit button used by every quick modal. */
export function QuickModalFooter({
  formId,
  actionLabel,
  linkLabel,
  onLink,
}: {
  formId: string;
  actionLabel: string;
  linkLabel?: string;
  onLink?: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <Button
        type="submit"
        form={formId}
        className="h-10 w-full rounded-lg bg-cta text-sm font-semibold text-white shadow-sm hover:bg-cta-hover active:bg-cta-active"
      >
        {actionLabel}
      </Button>
      {linkLabel && onLink && (
        <button
          type="button"
          onClick={onLink}
          className="text-xs font-semibold text-cta hover:text-cta-hover hover:underline"
        >
          {linkLabel}
        </button>
      )}
    </div>
  );
}
