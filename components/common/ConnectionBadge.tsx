import * as React from "react";
import { cn } from "@/lib/utils";

export type ConnectionState = "connected" | "degraded" | "disconnected" | "checking";

const dot: Record<ConnectionState, string> = {
  connected: "bg-success",
  degraded: "bg-warning",
  disconnected: "bg-danger",
  checking: "bg-neutral",
};

const defaultLabel: Record<ConnectionState, string> = {
  connected: "Connected",
  degraded: "Degraded",
  disconnected: "Disconnected",
  checking: "Checking…",
};

export interface ConnectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** e.g. "Primary Server" */
  name: string;
  state?: ConnectionState;
  label?: string;
  pulse?: boolean;
}

/** "● Primary Server: Connected" pill shown in page headers. */
export function ConnectionBadge({ name, state = "connected", label, pulse = true, className, ...props }: ConnectionBadgeProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-info-bg px-3 py-1.5 text-xs font-medium text-secondary",
        className
      )}
      {...props}
    >
      <span className="relative flex h-2 w-2">
        {pulse && state === "connected" && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", dot[state])} />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot[state])} />
      </span>
      <span>
        {name}: <span className="font-semibold">{label ?? defaultLabel[state]}</span>
      </span>
    </span>
  );
}
