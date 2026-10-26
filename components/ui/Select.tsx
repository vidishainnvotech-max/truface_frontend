"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldBase, fieldSizes } from "./Input";
import type { SelectOption } from "@/types/ui";
import type { Size } from "@/types/common";

export interface SelectProps<V extends string | number = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "onChange" | "value"> {
  options: SelectOption<V>[];
  value?: V;
  onChange?: (value: V) => void;
  placeholder?: string;
  selectSize?: Size;
  invalid?: boolean;
}

function SelectInner<V extends string | number = string>(
  { options, value, onChange, placeholder, selectSize = "md", invalid, className, ...props }: SelectProps<V>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        value={value ?? ""}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find((o) => String(o.value) === raw);
          if (match) onChange?.(match.value);
        }}
        className={cn(fieldBase, fieldSizes[selectSize], "appearance-none pr-9 cursor-pointer", className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
        aria-hidden
      />
    </div>
  );
}

export const Select = React.forwardRef(SelectInner) as <V extends string | number = string>(
  props: SelectProps<V> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => React.ReactElement;
