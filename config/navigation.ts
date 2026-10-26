import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  FileBarChart2,
  ScrollText,
  Settings,
} from "lucide-react";
import type { NavSection } from "@/types/navigation";

export const APP_NAME = "TRUFACE";
export const APP_SHORT_NAME = "TF";
export const APP_TAGLINE = "Admin Portal";

export const defaultUser = { name: "Aryan Sharma", role: "Super Admin", avatar: null };

export const navigation: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
      { label: "Employees", href: "/employees", icon: Users },
      { label: "Locations", href: "/locations", icon: MapPin },
      { label: "Attendance", href: "/attendance", icon: CalendarCheck },
      { label: "Security", href: "/security", icon: ShieldCheck },
      { label: "Reports", href: "/reports", icon: FileBarChart2 },
      { label: "Logs", href: "/logs", icon: ScrollText },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
