"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "@/components/common/Header";
import { AuthGuard } from "@/components/common/AuthGuard";
import { defaultUser } from "@/config/navigation";
import type { Crumb } from "@/components/common/Breadcrumbs";

const currentYear = new Date().getFullYear();

export interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Crumb[];
  /** Left-side header content (e.g. page title + subtitle). */
  header?: React.ReactNode;
  /** Right-side header controls (date picker, notifications, avatar...). */
  headerActions?: React.ReactNode;
  /** Wrap the page in the session guard. */
  guarded?: boolean;
  /** Max content width; "full" removes the cap. */
  width?: "default" | "full";
  className?: string;
}

export function DashboardLayout({
  children,
  breadcrumbs,
  header,
  headerActions,
  guarded = true,
  width = "default",
  className,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const displayUser = user ?? defaultUser;

  const shell = (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar user={displayUser} onLogout={logout} />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-primary/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="relative h-full w-[var(--sidebar-width)]">
            <Sidebar user={displayUser} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Right pane */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto scrollbar-thin">
        <Header breadcrumbs={breadcrumbs} actions={headerActions} onMenuClick={() => setMobileOpen(true)}>
          {header}
        </Header>
        <main className={cn("flex-1 p-6", width === "default" && "mx-auto w-full max-w-[1440px]", className)}>{children}</main>
        <footer className="border-t border-border px-6 py-3 text-xs text-foreground-muted">
          © {currentYear} TruFace Solutions. All rights reserved.
        </footer>
      </div>
    </div>
  );

  return guarded ? <AuthGuard>{shell}</AuthGuard> : shell;
}
