import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { Status, Tone } from "@/types/common";

/**
 * Maps a domain status to a badge tone (per design: Active=green, Pending=blue, Inactive=dark gray).
 */
const statusToneMap: Record<Status, Tone> = {
  active: "success",
  online: "success",
  pending: "info",
  inactive: "neutral",
  offline: "neutral",
  suspended: "warning",
  expired: "warning",
  error: "danger",
};

const statusLabelMap: Record<Status, string> = {
  active: "Active",
  online: "Online",
  pending: "Pending",
  inactive: "Inactive",
  offline: "Offline",
  suspended: "Suspended",
  expired: "Expired",
  error: "Error",
};

export interface StatusBadgeProps extends Omit<BadgeProps, "tone" | "children"> {
  status: Status;
  label?: string;
}

export function StatusBadge({ status, label, variant = "solid", dot, ...props }: StatusBadgeProps) {
  return (
    <Badge tone={statusToneMap[status]} variant={variant} dot={dot} {...props}>
      {label ?? statusLabelMap[status]}
    </Badge>
  );
}
