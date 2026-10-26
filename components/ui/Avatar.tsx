import * as React from "react";
import { cn, getInitials } from "@/lib/utils";
import type { Size } from "@/types/common";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string | null;
  size?: Size | "xs" | "xl";
  /** Presence indicator. */
  status?: "online" | "offline" | "busy";
  shape?: "circle" | "square";
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const statusColor = { online: "bg-success", offline: "bg-neutral", busy: "bg-danger" };

export function Avatar({ name, src, size = "md", status, shape = "circle", className, ...props }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible font-semibold text-white bg-brand-gradient",
        shape === "circle" ? "rounded-full" : "rounded-md",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn("h-full w-full object-cover", shape === "circle" ? "rounded-full" : "rounded-md")}
        />
      ) : (
        <span aria-hidden>{getInitials(name)}</span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-surface",
            statusColor[status]
          )}
          aria-label={status}
        />
      )}
    </span>
  );
}


