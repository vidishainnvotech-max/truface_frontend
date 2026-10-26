import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Typography per spec:
 *  - Heading: primary #002162 (display font via --font-heading when loaded)
 *  - Sub heading: #555555
 */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  gradient?: boolean;
}

const headingSizes: Record<HeadingLevel, string> = {
  1: "text-3xl font-bold tracking-tight",
  2: "text-2xl font-bold tracking-tight",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold uppercase tracking-wider",
};

export function Heading({ level = 2, gradient, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-heading leading-tight",
        headingSizes[level],
        gradient ? "text-brand-gradient" : "text-primary",
        className
      )}
      {...props}
    />
  );
}

export function Subheading({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-subheading", className)} {...props} />;
}

/** Monospace inline code / key display. */
export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary border border-border", className)}
      {...props}
    />
  );
}
