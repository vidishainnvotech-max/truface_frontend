import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: Omit<NavItem, "icon" | "children">[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
