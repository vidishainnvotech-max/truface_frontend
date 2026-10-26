"use client";

import type * as React from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/Button";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export interface HeaderProps {
  breadcrumbs?: Crumb[];
  /** Left-side content rendered after the breadcrumbs (e.g. page title). */
  children?: React.ReactNode;
  /** Right-side controls. */
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ breadcrumbs, children, actions, onMenuClick, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-4 border-b border-border bg-surface/95 px-6 backdrop-blur py-3",
        className
      )}
    >
      {onMenuClick && (
        <IconButton label="Toggle menu" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </IconButton>
      )}

      <div className="min-w-0 flex-1">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {children}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
    </header>
  );
}
