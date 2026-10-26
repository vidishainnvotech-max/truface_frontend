"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Select } from "./Select";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Returns page numbers with `null` for ellipsis. */
function getPages(current: number, total: number, siblings = 1): (number | null)[] {
  const totalNumbers = siblings * 2 + 5;
  if (total <= totalNumbers) return range(1, total);
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  if (!showLeftDots && showRightDots) return [...range(1, 3 + 2 * siblings), null, total];
  if (showLeftDots && !showRightDots) return [1, null, ...range(total - (2 + 2 * siblings), total)];
  return [1, null, ...range(left, right), null, total];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3 text-sm", className)}>
      <div className="flex items-center gap-3 text-foreground-muted">
        <span>
          Showing <span className="font-medium text-foreground">{from}</span>–
          <span className="font-medium text-foreground">{to}</span> of{" "}
          <span className="font-medium text-foreground">{total}</span>
        </span>
        {onPageSizeChange && (
          <div className="w-28">
            <Select
              selectSize="sm"
              value={pageSize}
              options={pageSizeOptions.map((n) => ({ label: `${n} / page`, value: n }))}
              onChange={(v) => onPageSizeChange(Number(v))}
              aria-label="Rows per page"
            />
          </div>
        )}
      </div>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          leftIcon={<ChevronLeft className="h-4 w-4" />}
        >
          Prev
        </Button>
        {getPages(page, totalPages).map((p, i) =>
          p === null ? (
            <span key={`dots-${i}`} className="px-2 text-foreground-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 rounded-md px-2 text-sm font-medium transition-colors focus-visible:focus-ring",
                p === page ? "bg-primary text-white" : "text-foreground-secondary hover:bg-surface-muted"
              )}
            >
              {p}
            </button>
          )
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          Next
        </Button>
      </nav>
    </div>
  );
}
