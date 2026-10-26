import * as React from "react";
import { cn } from "@/lib/utils";

export interface TruncateTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Full value used as the native hover tooltip. */
  title?: string;
  /** Max width before ellipsis (default 18rem). */
  maxWidth?: string;
}

/** Single-line table cell text: truncates with an ellipsis and shows the full
 *  value in a native tooltip on hover (never wraps to a second line). */
export function TruncateText({ children, title, maxWidth = "18rem", className, ...props }: TruncateTextProps) {
  return (
    <span
      title={title ?? (typeof children === "string" ? children : undefined)}
      style={{ maxWidth }}
      className={cn("block truncate whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </span>
  );
}
