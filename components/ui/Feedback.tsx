import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-neutral-bg/70", className)} aria-hidden {...props} />;
}
