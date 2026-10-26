"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Construction, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Heading, Subheading, Code } from "@/components/ui/Typography";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import type { Crumb } from "./Breadcrumbs";

/** "/settings/api-keys" -> "Api Keys" */
function titleFromPath(pathname: string): string {
  const last = pathname.split("/").filter(Boolean).pop() ?? "";
  return last
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/** "/settings/api-keys" -> [{Settings, /settings}, {Api Keys}] */
function crumbsFromPath(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p, i) => ({
    label: titleFromPath(`/${p}`),
    href: i < parts.length - 1 ? `/${parts.slice(0, i + 1).join("/")}` : undefined,
  }));
}

export interface ComingSoonProps {
  /** Full heading text. Defaults to "<Page Name> is coming soon" derived from the URL. */
  title?: string;
  description?: React.ReactNode;
  /** Render without the dashboard shell (e.g. when already inside a layout). */
  bare?: boolean;
}

export function ComingSoon({ title, description, bare }: ComingSoonProps) {
  const pathname = usePathname();
  const router = useRouter();
  const heading = title ?? `${titleFromPath(pathname) || "This page"} is coming soon`;

  const content = (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-elevated">
        <Construction className="h-9 w-9" />
      </span>

      <Badge tone="info" variant="soft" size="md" className="mb-4">
        In development
      </Badge>

      <Heading level={1} className="text-3xl">
        {heading}
      </Heading>
      <Subheading className="mt-3 max-w-md text-base">
        {description ??
          "This section of the platform is still being built. Check back shortly — we're working on it."}
      </Subheading>

      <p className="mt-4 text-xs text-foreground-muted">
        Requested route: <Code>{pathname}</Code>
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
          Go back
        </Button>
        <Button variant="primary" leftIcon={<LayoutDashboard className="h-4 w-4" />} href="/">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );

  if (bare) return content;

  return <DashboardLayout breadcrumbs={crumbsFromPath(pathname)}>{content}</DashboardLayout>;
}
