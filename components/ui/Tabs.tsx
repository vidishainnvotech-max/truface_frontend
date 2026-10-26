"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: "underline" | "pills" | "boxed";
  size?: "sm" | "md";
  className?: string;
  /** Content per tab (keyed by value). If omitted, Tabs renders only the tab list. */
  children?: React.ReactNode;
}

const TabsContext = React.createContext<{ value: string } | null>(null);

export function Tabs({
  items,
  value: controlled,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  className,
  children,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value ?? "");
  const value = controlled ?? internal;

  const select = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.value === value);
    if (e.key === "ArrowRight") select(enabled[(idx + 1) % enabled.length].value);
    if (e.key === "ArrowLeft") select(enabled[(idx - 1 + enabled.length) % enabled.length].value);
  };

  return (
    <TabsContext.Provider value={{ value }}>
      <div className={className}>
        <div
          role="tablist"
          onKeyDown={onKeyDown}
          className={cn(
            "flex items-center gap-1",
            variant === "underline" && "border-b border-border",
            variant === "boxed" && "rounded-md bg-surface-muted p-1 w-fit"
          )}
        >
          {items.map((item) => {
            const active = item.value === value;
            return (
              <button
                key={item.value}
                role="tab"
                type="button"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                disabled={item.disabled}
                onClick={() => select(item.value)}
                className={cn(
                  "inline-flex items-center gap-2 font-medium whitespace-nowrap transition-colors focus-visible:focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
                  size === "sm" ? "text-xs" : "text-sm",
                  variant === "underline" &&
                    cn(
                      "-mb-px border-b-2 px-3 py-2.5",
                      active
                        ? "border-secondary text-secondary"
                        : "border-transparent text-foreground-secondary hover:text-foreground hover:border-border-strong"
                    ),
                  variant === "pills" &&
                    cn(
                      "rounded-full px-3.5 py-1.5",
                      active ? "bg-primary text-white" : "text-foreground-secondary hover:bg-surface-muted"
                    ),
                  variant === "boxed" &&
                    cn(
                      "rounded px-3 py-1.5",
                      active ? "bg-surface text-primary shadow-sm" : "text-foreground-secondary hover:text-foreground"
                    )
                )}
              >
                {item.icon}
                {item.label}
                {item.badge}
              </button>
            );
          })}
        </div>
        {children}
      </div>
    </TabsContext.Provider>
  );
}


