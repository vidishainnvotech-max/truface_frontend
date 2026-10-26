"use client";

import * as React from "react";
import { Braces, Check, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Called with parse result whenever the value changes. */
  onValidate?: (valid: boolean, error?: string) => void;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** Show the toolbar with Format button + validity indicator (default true). */
  toolbar?: boolean;
  className?: string;
  id?: string;
}

function parse(value: string): { ok: true; data: unknown } | { ok: false; error: string } {
  if (!value.trim()) return { ok: true, data: undefined };
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch (e) {
    return { ok: false, error: (e as Error).message.replace(/^JSON\.parse: /, "") };
  }
}

/** Dark-themed JSON textarea (matches "Platform Configurations JSON Editor"). */
export function JsonEditor({
  value,
  onChange,
  onValidate,
  rows = 8,
  placeholder = "{\n  \n}",
  disabled,
  readOnly,
  toolbar = true,
  className,
  id,
}: JsonEditorProps) {
  const result = React.useMemo(() => parse(value), [value]);

  const handleChange = (next: string) => {
    onChange(next);
    const r = parse(next);
    onValidate?.(r.ok, r.ok ? undefined : r.error);
  };

  const format = () => {
    if (result.ok && result.data !== undefined) handleChange(JSON.stringify(result.data, null, 2));
  };

  // Insert two spaces on Tab instead of leaving the field.
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    const next = value.slice(0, s) + "  " + value.slice(end);
    handleChange(next);
    requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
  };

  return (
    <div className={cn("overflow-hidden rounded-md border border-primary/60 bg-primary shadow-inner", className)}>
      {toolbar && (
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/60">
            <Braces className="h-3.5 w-3.5" /> JSON
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] font-medium",
                result.ok ? "text-accent" : "text-red-300"
              )}
            >
              {result.ok ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Valid
                </>
              ) : (
                "Invalid JSON"
              )}
            </span>
            {!readOnly && !disabled && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={format}
                disabled={!result.ok}
                className="h-6 px-2 text-[11px] text-white/80 hover:bg-white/10 hover:text-white"
                leftIcon={<WandSparkles className="h-3 w-3" />}
              >
                Format
              </Button>
            )}
          </div>
        </div>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
        spellCheck={false}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        aria-invalid={!result.ok || undefined}
        className={cn(
          "block w-full resize-y bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-cyan-100",
          "placeholder:text-white/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 scrollbar-thin"
        )}
      />
      {!result.ok && (
        <p role="alert" className="border-t border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200">
          {result.error}
        </p>
      )}
    </div>
  );
}
