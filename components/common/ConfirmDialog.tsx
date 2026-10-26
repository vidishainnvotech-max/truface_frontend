"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive confirmations. */
  tone?: "primary" | "danger";
  /** Require the user to type this text to enable confirm (e.g. tenant name). */
  confirmText?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  confirmText,
  loading,
}: ConfirmDialogProps) {
  const [typed, setTyped] = React.useState("");

  const disabled = Boolean(confirmText) && typed !== confirmText;
  const variant: ButtonVariant = tone === "danger" ? "danger" : "primary";

  const handleClose = () => {
    setTyped("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="sm"
      dismissible={!loading}
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={disabled} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {tone === "danger" && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger">
            <AlertTriangle className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-primary">{title}</h2>
            {description && <p className="mt-1 text-sm text-foreground-secondary">{description}</p>}
          </div>
          {confirmText && (
            <div className="space-y-1.5">
              <p className="text-xs text-foreground-muted">
                Type <span className="font-mono font-semibold text-foreground">{confirmText}</span> to confirm.
              </p>
              <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={confirmText} autoFocus />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
