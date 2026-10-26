"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/Input";

export interface SearchBarProps extends Omit<InputProps, "value" | "onChange" | "leftIcon" | "rightIcon"> {
  value: string;
  onChange: (value: string) => void;
  /** Debounce ms for onDebouncedChange (default 300). */
  debounce?: number;
  onDebouncedChange?: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
  debounce = 300,
  onDebouncedChange,
  placeholder = "Search…",
  className,
  ...props
}: SearchBarProps) {
  React.useEffect(() => {
    if (!onDebouncedChange) return;
    const t = setTimeout(() => onDebouncedChange(value), debounce);
    return () => clearTimeout(t);
  }, [value, debounce, onDebouncedChange]);

  return (
    <Input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leftIcon={<Search />}
      rightIcon={
        value ? (
          <button type="button" aria-label="Clear search" onClick={() => onChange("")} className="pointer-events-auto hover:text-foreground">
            <X />
          </button>
        ) : undefined
      }
      className={cn("[&::-webkit-search-cancel-button]:hidden", className)}
      {...props}
    />
  );
}

/** Row of search + filters + right-aligned actions, used above DataTables. */
export interface TableToolbarProps {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  /** Bulk actions shown when items are selected. */
  selectedCount?: number;
  bulkActions?: React.ReactNode;
  className?: string;
}

export function TableToolbar({ search, filters, actions, selectedCount = 0, bulkActions, className }: TableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {selectedCount > 0 && bulkActions ? (
        <div className="flex flex-1 items-center gap-3 rounded-md bg-row-highlight px-3 py-2 text-sm">
          <span className="font-medium text-primary">{selectedCount} selected</span>
          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      ) : (
        <>
          {search && <div className="w-full sm:w-72">{search}</div>}
          {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
        </>
      )}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}
