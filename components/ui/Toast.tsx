"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  tone?: ToastTone;
  /** Auto-dismiss delay in ms (default 3500). */
  duration?: number;
}

export interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const ToastContext = React.createContext<ToastApi | null>(null);

const toneStyles: Record<ToastTone, { card: string; icon: string; Icon: typeof Info }> = {
  success: { card: "border-success/40 bg-success-bg", icon: "text-success", Icon: CheckCircle2 },
  error: { card: "border-danger/40 bg-danger-bg", icon: "text-danger", Icon: AlertCircle },
  info: { card: "border-secondary/40 bg-info-bg", icon: "text-secondary", Icon: Info },
  warning: { card: "border-warning/40 bg-warning-bg", icon: "text-warning", Icon: AlertTriangle },
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { card, icon, Icon } = toneStyles[item.tone];
  return (
    <div
      role="status"
      className={cn(
        "animate-toast-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border px-4 py-3 shadow-elevated",
        card
      )}
    >
      <Icon className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", icon)} aria-hidden />
      <p className="flex-1 text-sm font-medium text-foreground">{item.message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(item.id)}
        className="shrink-0 rounded p-0.5 text-foreground-muted transition-colors hover:text-foreground focus-visible:focus-ring"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Global toast host: hot messages stacked at the top center of the screen. */
export function ToastProvider({ children }: React.PropsWithChildren) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const counter = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (message: string, options?: ToastOptions) => {
      counter.current += 1;
      const id = counter.current;
      setItems((prev) => [...prev.slice(-4), { id, message, tone: options?.tone ?? "success" }]);
      window.setTimeout(() => dismiss(id), options?.duration ?? 3500);
    },
    [dismiss]
  );

  const api = React.useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, { tone: "success" }),
      error: (message) => push(message, { tone: "error" }),
      info: (message) => push(message, { tone: "info" }),
      warning: (message) => push(message, { tone: "warning" }),
    }),
    [push]
  );

  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="true"
            className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2.5 px-4"
          >
            {items.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>.");
  return ctx;
}
