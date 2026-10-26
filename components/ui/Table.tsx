import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  dense?: boolean;
  bordered?: boolean;
}

export function Table({ className, striped = true, dense, bordered = true, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto scrollbar-thin",
        bordered && "rounded-lg border border-border bg-surface"
      )}
    >
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          striped && "[&_tbody_tr:nth-child(even)]:bg-row-alt",
          dense ? "[&_td]:py-2 [&_th]:py-2" : "[&_td]:py-3 [&_th]:py-3",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-primary text-white", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  highlighted?: boolean;
  selected?: boolean;
  clickable?: boolean;
}

export function TableRow({ className, highlighted, selected, clickable, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors",
        clickable && "cursor-pointer hover:bg-row-highlight",
        (highlighted || selected) && "!bg-row-highlight",
        className
      )}
      aria-selected={selected || undefined}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}

export function TableHead({ className, align = "left", ...props }: TableHeadProps) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      {...props}
    />
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}

export function TableCell({ className, align = "left", ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        "px-4 text-foreground align-middle",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
      {...props}
    />
  );
}

export function TableLink({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn("font-medium text-secondary hover:underline underline-offset-2", className)}
      {...props}
    />
  );
}
