import * as React from "react";
import { ScanFace } from "lucide-react";
import { cn } from "@/lib/utils";

/** Field styling shared by every auth screen (CTA-blue focus ring). */
export const authFieldClass =
  "h-10 rounded-lg border-border-strong bg-surface focus:border-cta";

/** Full-width CTA button shared by every auth screen. */
export const authButtonClass =
  "h-10 w-full rounded-lg bg-cta text-sm font-semibold text-white shadow-sm " +
  "hover:bg-cta-hover active:bg-cta-active";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cta text-white">
        <ScanFace className="h-5 w-5" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-extrabold tracking-[0.14em] text-foreground">
          TRUFACE
        </span>
        <span className="block text-[10px] text-foreground-muted">Admin · Finance Suite</span>
      </span>
    </div>
  );
}

export interface AuthSplitLayoutProps {
  /** Heading shown at the bottom of the dark brand panel. */
  panelTitle: string;
  /** Supporting copy under the panel heading. */
  panelDescription: string;
  children: React.ReactNode;
  /** Center the form card vertically instead of aligning to the top. */
  center?: boolean;
  className?: string;
}

function BrandPanelArt() {
  return (
    <div
      aria-hidden
      className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] border border-[#3b82f6]/45 bg-[#0b1f4d]/50"
    >
      <svg viewBox="0 0 100 64" className="w-24 text-[#60a5fa]" fill="none">
        <circle cx="36" cy="18" r="5.5" fill="currentColor" />
        <circle cx="64" cy="18" r="5.5" fill="currentColor" />
        <path
          d="M30 38c5.5 10 34.5 10 40 0"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function AuthSplitLayout({
  panelTitle,
  panelDescription,
  children,
  center = true,
  className,
}: AuthSplitLayoutProps) {
  return (
    <div className={cn("flex min-h-screen bg-surface", className)}>
      {/* Brand panel */}
      <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-[#061434] px-10 py-8 lg:flex xl:px-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#1d4ed8]/35 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#0180c1]/25 blur-[100px]"
        />

        <div className="relative inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
          <span className="grid h-4 w-4 place-items-center rounded-[4px] border border-[#60a5fa]/70">
            <span className="h-1 w-1 rounded-full bg-[#60a5fa]" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
            TruFace India
          </span>
        </div>

        <div className="relative flex flex-1 items-center justify-center py-8">
          <BrandPanelArt />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-2xl font-bold leading-snug text-white xl:text-[26px]">{panelTitle}</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-white/55">{panelDescription}</p>
        </div>
      </aside>

      {/* Form panel */}
      <main className="relative flex min-w-0 flex-1 flex-col bg-surface">
        <header className="px-6 py-6 sm:px-10 xl:px-16">
          <BrandLogo />
        </header>
        <div
          className={cn(
            "flex flex-1 px-6 pb-14 sm:px-10 xl:px-16",
            center ? "items-center" : "items-start pt-4"
          )}
        >
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>
      </main>
    </div>
  );
}
