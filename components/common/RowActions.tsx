"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";

export type RowActionTone = "primary" | "success" | "danger" | "neutral" | "accent";

export interface RowAction {
  label: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  tone?: RowActionTone;
  disabled?: boolean;
  hidden?: boolean;
}

const tones: Record<RowActionTone, string> = {
  primary: "text-secondary hover:bg-info-bg",
  success: "text-success hover:bg-success-bg",
  danger: "text-danger hover:bg-danger-bg",
  neutral: "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
  accent: "text-accent hover:bg-info-bg",
};

export interface RowActionsProps {
  actions: RowAction[];
  className?: string;
}

/** Compact inline icon actions for table rows (edit / view / delete …). */
export function RowActions({ actions, className }: RowActionsProps) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} onClick={(e) => e.stopPropagation()}>
      {actions
        .filter((a) => !a.hidden)
        .map((a, i) => {
          const cls = cn(
            "inline-flex h-7 w-7 items-center justify-center rounded transition-colors focus-visible:focus-ring [&>svg]:h-4 [&>svg]:w-4",
            tones[a.tone ?? "primary"],
            a.disabled && "pointer-events-none opacity-40"
          );
          const el =
            a.href && !a.disabled ? (
              <Link href={a.href} aria-label={a.label} className={cls}>
                {a.icon}
              </Link>
            ) : (
              <button type="button" aria-label={a.label} disabled={a.disabled} onClick={a.onClick} className={cls}>
                {a.icon}
              </button>
            );
          return (
            <Tooltip key={i} content={a.label}>
              {el}
            </Tooltip>
          );
        })}
    </div>
  );
}

/** Convenience factory for the standard edit / view / delete trio. */
export function crudActions(opts: {
  editHref?: string;
  viewHref?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  labels?: Partial<Record<"edit" | "view" | "delete", string>>;
}): RowAction[] {
  const l = { edit: "Edit", view: "View details", delete: "Delete", ...opts.labels };
  return [
    { label: l.edit, icon: <Pencil />, href: opts.editHref, onClick: opts.onEdit, tone: "primary", hidden: !opts.editHref && !opts.onEdit },
    { label: l.view, icon: <Eye />, href: opts.viewHref, onClick: opts.onView, tone: "success", hidden: !opts.viewHref && !opts.onView },
    { label: l.delete, icon: <Trash2 />, onClick: opts.onDelete, tone: "danger", hidden: !opts.onDelete },
  ];
}
