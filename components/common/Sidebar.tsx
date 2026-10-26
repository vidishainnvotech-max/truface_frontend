"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, APP_TAGLINE } from "@/config/navigation";
import type { NavItem, NavSection } from "@/types/navigation";
import { Avatar } from "@/components/ui/Avatar";

export interface SidebarProps {
  sections?: NavSection[];
  user?: { name: string; role?: string; avatar?: string | null };
  onLogout?: () => void;
  className?: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  sections = navigation,
  user,
  onLogout,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden bg-primary text-white",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-[var(--header-height)] items-center gap-3 border-b border-white/10 px-4">
        <Link href="/admin-dashboard" className="flex items-center gap-3">
          <Image src="/logo.png" alt="TruFace" width={40} height={40} className="shrink-0 rounded-md" priority />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-bold tracking-wide">TruFace India</p>
            <p className="truncate text-[10px] uppercase tracking-widest text-white/60">{APP_TAGLINE}</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-4 space-y-5">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem key={item.href} item={item} pathname={pathname} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer – user + logout */}
      {user && (
        <div className="flex items-center gap-2 border-t border-white/10 p-3">
          <Avatar name={user.name} src={user.avatar} size="sm" status="online" />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-medium">{user.name}</p>
            {user.role && <p className="truncate text-[11px] text-white/60">{user.role}</p>}
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="shrink-0 rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </aside>
  );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  const hasChildren = Boolean(item.children?.length);
  const [open, setOpen] = React.useState(active);
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-secondary text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
      onClick={(e) => {
        if (hasChildren) {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none">{item.badge}</span>
      )}
      {hasChildren && (
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      )}
    </Link>
  );

  return (
    <li>
      {link}
      {hasChildren && open && (
        <ul className="mt-0.5 ml-4 space-y-0.5 border-l border-white/10 pl-3">
          {item.children!.map((child) => {
            const childActive = pathname === child.href;
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={childActive ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-1.5 text-[13px] transition-colors",
                    childActive ? "text-white font-medium bg-white/10" : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
