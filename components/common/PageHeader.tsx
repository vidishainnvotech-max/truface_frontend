import * as React from "react";
import { cn } from "@/lib/utils";
import { Heading, Subheading } from "@/components/ui/Typography";

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned actions (usually Buttons). */
  actions?: React.ReactNode;
  /** Optional element rendered left of the title (icon, avatar, back button). */
  leading?: React.ReactNode;
  /** Slot below the header, e.g. Tabs. */
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, leading, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {leading}
          <div className="min-w-0">
            <Heading level={1} className="text-2xl">
              {title}
            </Heading>
            {description && <Subheading className="mt-1">{description}</Subheading>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/** Section title inside a page (used above tables / form groups). */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: Omit<PageHeaderProps, "leading" | "children">) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        <Heading level={4}>{title}</Heading>
        {description && <Subheading className="mt-0.5">{description}</Subheading>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
