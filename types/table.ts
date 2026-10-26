export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  /** Single-line ellipsis + hover tooltip for text cells (default: true). */
  truncate?: boolean;
  /** Max width before the ellipsis kicks in (default 16rem). */
  truncateWidth?: string;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}
