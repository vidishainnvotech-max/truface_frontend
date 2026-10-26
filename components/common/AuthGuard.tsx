"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const PUBLIC_PATHS = [
  "/admin-login",
  "/admin-sign-up",
  "/forgot-password",
  "/otp-verification",
  "/reset-password",
  "/access-denied",
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  React.useEffect(() => {
    if (loading) return;

    // Redirect logged-in users away from public pages
    if (user && isPublic) {
      router.replace("/admin-dashboard");
      return;
    }

    // Redirect unauthenticated users to login
    if (!user && !isPublic) {
      router.replace("/admin-login");
    }
  }, [user, loading, isPublic, router]);

  // Show nothing while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!user && !isPublic) return null;

  // Don't render public pages if already authenticated
  if (user && isPublic) return null;

  return <>{children}</>;
}
