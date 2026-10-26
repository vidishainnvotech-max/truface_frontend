import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  const all: Crumb[] = showHome ? [{ label: <Home className="h-3.5 w-3.5" />, href: "/" }, ...items] : items;
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="flex items-center text-foreground-muted hover:text-secondary transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn("flex items-center", last ? "font-medium text-primary" : "text-foreground-muted")}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 text-foreground-muted" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
