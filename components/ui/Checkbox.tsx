"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate, className, id, checked, disabled, onChange, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = Boolean(indeterminate);
    }, [indeterminate]);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={innerRef}
            id={inputId}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded border border-border-strong bg-surface transition-colors checked:border-secondary checked:bg-secondary indeterminate:border-secondary indeterminate:bg-secondary focus-visible:focus-ring disabled:cursor-not-allowed"
            {...props}
          />
          {indeterminate ? (
            <Minus className="pointer-events-none relative h-3 w-3 text-white opacity-0 peer-indeterminate:opacity-100" />
          ) : (
            <Check className="pointer-events-none relative h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
          )}
        </span>
        {(label || description) && (
          <span className="flex flex-col leading-tight">
            {label && <span className="text-sm text-foreground">{label}</span>}
            {description && <span className="text-xs text-foreground-muted">{description}</span>}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
