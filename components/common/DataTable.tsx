"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Checkbox } from "@/components/ui/Checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Feedback";
import { EmptyState } from "./EmptyState";
import { TruncateText } from "./TruncateText";
import type { Column, SortState } from "@/types/table";

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Unique key per row. */
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Skeleton rows shown while loading. */
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;

  /* selection */
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;

  /* sorting (controlled) */
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;

  /* pagination (controlled) */
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };

  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string | undefined;
  highlightRow?: (row: T) => boolean;
  striped?: boolean;
  dense?: boolean;
  /** Toolbar rendered above the table (search, filters, bulk actions). */
  toolbar?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  skeletonRows = 6,
  emptyTitle = "No results",
  emptyDescription = "Nothing to show here yet.",
  emptyAction,
  selectable,
  selectedKeys = [],
  onSelectionChange,
  sort,
  onSortChange,
  pagination,
  onRowClick,
  rowClassName,
  highlightRow,
  striped = true,
  dense,
  toolbar,
  className,
}: DataTableProps<T>) {
  const keys = data.map(rowKey);
  const allSelected = keys.length > 0 && keys.every((k) => selectedKeys.includes(k));
  const someSelected = !allSelected && keys.some((k) => selectedKeys.includes(k));

  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? Array.from(new Set([...selectedKeys, ...keys])) : selectedKeys.filter((k) => !keys.includes(k)));
  };

  const toggleOne = (key: string, checked: boolean) => {
    if (!onSelectionChange) return;
    onSelectionChange(checked ? [...selectedKeys, key] : selectedKeys.filter((k) => k !== key));
  };

  const handleSort = (col: Column<T>) => {
    if (!col.sortable || !onSortChange) return;
    if (!sort || sort.key !== col.key) return onSortChange({ key: col.key, direction: "asc" });
    if (sort.direction === "asc") return onSortChange({ key: col.key, direction: "desc" });
    onSortChange(null);
  };

  const colCount = columns.length + (selectable ? 1 : 0);

  return (
    <div className={cn("space-y-3", className)}>
      {toolbar}

      <Table striped={striped} dense={dense}>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  className="[&_input]:border-white/40 [&_input]:bg-transparent"
                />
              </TableHead>
            )}
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              return (
                <TableHead key={col.key} align={col.align} style={{ width: col.width }} className={col.headerClassName}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col)}
                      className="inline-flex items-center gap-1 uppercase hover:text-white/80 focus-visible:focus-ring rounded"
                    >
                      {col.header}
                      {isSorted ? (
                        sort!.direction === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {Array.from({ length: colCount }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} className="!bg-surface">
                <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} compact />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => {
              const key = rowKey(row);
              const selected = selectedKeys.includes(key);
              return (
                <TableRow
                  key={key}
                  selected={selected}
                  highlighted={highlightRow?.(row)}
                  clickable={Boolean(onRowClick)}
                  onClick={() => onRowClick?.(row)}
                  className={rowClassName?.(row)}
                >
                  {selectable && (
                    <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label={`Select row ${i + 1}`}
                        checked={selected}
                        onChange={(c) => toggleOne(key, c)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => {
                    const rendered = col.render
                      ? col.render(row, i)
                      : String((row as Record<string, unknown>)[col.key] ?? "");
                    // Plain-text cells stay on one line: ellipsis + full value on hover.
                    const content =
                      col.truncate !== false && typeof rendered === "string" && rendered !== "" ? (
                        <TruncateText maxWidth={col.truncateWidth} title={rendered}>
                          {rendered}
                        </TruncateText>
                      ) : (
                        rendered
                      );
                    return (
                      <TableCell key={col.key} align={col.align} className={col.className}>
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  );
}
