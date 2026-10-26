/**
 * Brand theme constants. Prefer Tailwind classes (bg-primary, text-secondary, ...)
 * in components; use these when a raw value is required (charts, canvas, inline SVG).
 */
export const theme = {
  colors: {
    primary: "#002162",
    secondary: "#0180C1",
    accent: "#00B7D2",
    subheading: "#555555",
    rowAlt: "#EEF3FA",
    rowHighlight: "#E5F9FB",
    border: "#E3E8EF",
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
    info: "#0180C1",
    neutral: "#4B5563",
    muted: "#8A94A6",
  },
  gradient: {
    from: "#0180C1",
    to: "#00B7D2",
    css: "linear-gradient(90deg, #0180C1 0%, #00B7D2 100%)",
  },
  /** Ordered palette for multi-series charts. */
  chartPalette: ["#002162", "#0180C1", "#00B7D2", "#7DD3FC", "#94A3B8", "#16A34A", "#D97706"],
} as const;
