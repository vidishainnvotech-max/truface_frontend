"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Size } from "@/types/common";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "gradient"
  | "danger"
  | "link";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium " +
  "transition-colors duration-150 select-none " +
  "focus-visible:focus-ring disabled:pointer-events-none " +
  "disabled:bg-neutral-bg disabled:text-foreground-muted disabled:border-transparent disabled:shadow-none";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm",
  secondary: "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active shadow-sm",
  accent: "bg-accent text-white hover:bg-accent-hover active:bg-accent-active shadow-sm",
  outline:
    "border border-secondary text-secondary bg-transparent hover:bg-info-bg active:bg-secondary active:text-white",
  ghost: "text-foreground-secondary bg-transparent hover:bg-surface-muted active:bg-neutral-bg",
  gradient:
    "bg-brand-gradient text-white shadow-sm hover:brightness-110 active:brightness-95 disabled:bg-none",
  danger: "bg-danger text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
  link: "text-secondary underline-offset-4 hover:underline p-0 h-auto",
};

const buttonSizes: Record<Size | "icon", string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "h-9 w-9 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size | "icon";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth,
      href,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classes = cn(
      base,
      buttonVariants[variant],
      buttonSizes[size],
      fullWidth && "w-full",
      className
    );

    const content = (
      <>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);
Button.displayName = "Button";

/* ---------------- IconButton ---------------- */
export interface IconButtonProps extends Omit<ButtonProps, "size" | "leftIcon" | "rightIcon"> {
  label: string;
  size?: Size;
}

const iconSizes: Record<Size, string> = { sm: "h-8 w-8", md: "h-9 w-9", lg: "h-11 w-11" };

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, size = "md", variant = "ghost", className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size="icon"
      aria-label={label}
      title={label}
      className={cn(iconSizes[size], className)}
      {...props}
    >
      {children}
    </Button>
  )
);
IconButton.displayName = "IconButton";
