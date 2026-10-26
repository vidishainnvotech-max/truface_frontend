import * as React from "react";
import { cn } from "@/lib/utils";

export interface SettingRowProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SettingRow({ title, description, children, className }: SettingRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0 border-b border-border last:border-0", className)}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
