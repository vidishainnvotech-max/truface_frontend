"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  /** Render a separator before this item. */
  separator?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
}

export function Dropdown({ trigger, items, align = "right", className, menuClassName }: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </div>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-40 mt-1.5 min-w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-elevated",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
        >
          {items.map((item, i) => {
            const cls = cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors",
              item.disabled
                ? "cursor-not-allowed text-foreground-muted"
                : item.danger
                  ? "text-danger hover:bg-danger-bg"
                  : "text-foreground hover:bg-surface-muted"
            );
            const inner = (
              <>
                {item.icon && <span className="[&>svg]:h-4 [&>svg]:w-4 text-current">{item.icon}</span>}
                {item.label}
              </>
            );
            return (
              <React.Fragment key={i}>
                {item.separator && <div className="my-1 h-px bg-border" role="separator" />}
                {item.href && !item.disabled ? (
                  <a href={item.href} role="menuitem" className={cls} onClick={() => setOpen(false)}>
                    {inner}
                  </a>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={cls}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                  >
                    {inner}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
