"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Close when clicking the backdrop (default true). */
  dismissible?: boolean;
  className?: string;
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  dismissible = true,
  className,
}: ModalProps) {
  const titleId = React.useId();
  // Portal target is only available on the client; subscribe via useSyncExternalStore to avoid setState-in-effect.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismissible && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, dismissible]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && dismissible && onClose()}
    >
      <div className="absolute inset-0 bg-primary/50 backdrop-blur-[2px]" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "relative flex max-h-[calc(100vh-2rem)] w-full flex-col rounded-lg bg-surface shadow-elevated animate-in",
          sizes[size],
          className
        )}
      >
        {(title || dismissible) && (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              {title && (
                <h2 id={titleId} className="text-lg font-semibold text-primary">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-foreground-muted">{description}</p>}
            </div>
            {dismissible && (
              <IconButton label="Close" size="sm" onClick={onClose} className="-mr-2 -mt-1">
                <X className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-surface-muted/60 px-6 py-4 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
