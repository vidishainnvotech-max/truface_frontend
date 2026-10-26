import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function EmptyState({ title, description, icon, action, compact, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", compact ? "py-10" : "py-20", className)}>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-row-alt text-secondary [&>svg]:h-6 [&>svg]:w-6">
        {icon ?? <Inbox />}
      </span>
      <p className="text-base font-semibold text-primary">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-foreground-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
