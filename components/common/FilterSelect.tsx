"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/ui";

export interface FilterSelectProps<V extends string = string> {
  /** Prefix shown before the value, e.g. "Status". */
  label: string;
  value: V;
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  /** Option value that means "no filter" (rendered as "All"). Default "all". */
  allValue?: V;
  className?: string;
}

/** Compact inline filter: "Status: All ▾" — used in table toolbars. */
export function FilterSelect<V extends string = string>({
  label,
  value,
  options,
  onChange,
  allValue = "all" as V,
  className,
}: FilterSelectProps<V>) {
  const id = React.useId();
  const active = value !== allValue;
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex h-8 items-center rounded-md border bg-surface pl-3 pr-8 text-xs transition-colors cursor-pointer",
        active ? "border-secondary text-secondary" : "border-border text-foreground-secondary hover:border-border-strong",
        className
      )}
    >
      <span className="pointer-events-none whitespace-nowrap">
        {label}: <span className="font-semibold text-foreground">{options.find((o) => o.value === value)?.label ?? "All"}</span>
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as V)}
        className="absolute inset-0 w-full cursor-pointer opacity-0"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-3.5 w-3.5" />
    </label>
  );
}
