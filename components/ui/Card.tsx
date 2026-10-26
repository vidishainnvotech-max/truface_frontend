import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const paddings = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };

export function Card({ className, padding = "md", hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card",
        paddings[padding],
        hoverable && "transition-shadow hover:shadow-elevated",
        className
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)} {...props}>
      <div className="min-w-0">
        {title && <h3 className="text-base font-semibold text-primary leading-tight">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-sm text-foreground-muted">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}


