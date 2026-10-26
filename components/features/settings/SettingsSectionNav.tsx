"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { settingsSections } from "@/config/settings-options";

export interface SettingsSectionNavProps {
  className?: string;
}

export function SettingsSectionNav({ className }: SettingsSectionNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Settings sections"
      className={cn("flex flex-row gap-1 overflow-x-auto scrollbar-thin lg:flex-col lg:gap-1.5 lg:overflow-visible", className)}
    >
      {settingsSections.map((section) => {
        const active = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:focus-ring",
              active
                ? "bg-secondary text-white shadow-sm"
                : "text-foreground-secondary hover:bg-surface-muted hover:text-foreground"
            )}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
