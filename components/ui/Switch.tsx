"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md";
  id?: string;
  className?: string;
  /** Put label on the left of the toggle (settings-row style). */
  labelPosition?: "left" | "right";
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
  size = "md",
  id,
  className,
  labelPosition = "right",
}: SwitchProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;

  const track = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumb = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const translate = size === "sm" ? "translate-x-4" : "translate-x-5";

  const toggle = (
    <button
      id={switchId}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        track,
        checked ? "bg-secondary" : "bg-border-strong"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none inline-block rounded-full bg-white shadow transition-transform",
          thumb,
          checked ? translate : "translate-x-0"
        )}
      />
    </button>
  );

  if (!label && !description) return toggle;

  const text = (
    <label htmlFor={switchId} className="flex flex-col leading-tight cursor-pointer">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      {description && <span className="text-xs text-foreground-muted">{description}</span>}
    </label>
  );

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        labelPosition === "left" && "justify-between w-full",
        className
      )}
    >
      {labelPosition === "left" ? (
        <>
          {text}
          {toggle}
        </>
      ) : (
        <>
          {toggle}
          {text}
        </>
      )}
    </div>
  );
}
