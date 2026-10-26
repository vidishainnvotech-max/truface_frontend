"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Size } from "@/types/common";

export const fieldBase =
  "w-full rounded-md border border-border bg-surface text-sm text-foreground " +
  "placeholder:text-foreground-muted transition-colors " +
  "hover:border-border-strong focus:border-secondary focus-visible:focus-ring " +
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground-muted " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:border-danger";

export const fieldSizes: Record<Size, string> = {
  sm: "h-8 px-2.5 text-xs",
  md: "h-10 px-3",
  lg: "h-12 px-4 text-base",
};

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "md", leftIcon, rightIcon, invalid, ...props }, ref) => {
    const hasAddon = Boolean(leftIcon || rightIcon);

    const input = (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldBase,
          fieldSizes[inputSize],
          leftIcon && "pl-9",
          rightIcon && "pr-9",
          className
        )}
        {...props}
      />
    );

    if (!hasAddon) return input;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground-muted [&>svg]:h-4 [&>svg]:w-4">
            {leftIcon}
          </span>
        )}
        {input}
        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-foreground-muted [&>svg]:h-4 [&>svg]:w-4">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";


