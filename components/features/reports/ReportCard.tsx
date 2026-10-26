import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { ReportCard as ReportCardType } from "@/types/reports";

export interface ReportCardProps {
  report: ReportCardType;
  onGenerate?: (report: ReportCardType) => void;
  className?: string;
}

export function ReportCard({ report, onGenerate, className }: ReportCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="flex items-start gap-3 mb-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-row-alt text-secondary [&>svg]:h-5 [&>svg]:w-5">
          {report.icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-primary leading-tight">{report.title}</h3>
          <p className="mt-1 text-xs text-foreground-muted leading-relaxed">{report.description}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 text-xs pt-3 border-t border-border">
        <div>
          <span className="text-foreground-muted uppercase tracking-wider text-[10px] font-semibold">Frequency</span>
          <p className="mt-0.5 font-medium text-foreground">{report.frequency}</p>
        </div>
        <div>
          <span className="text-foreground-muted uppercase tracking-wider text-[10px] font-semibold">Last Generated</span>
          <p className="mt-0.5 font-medium text-foreground">{report.lastGenerated}</p>
        </div>
      </div>

      <Button
        variant="secondary"
        size="sm"
        className="mt-4 w-full"
        onClick={() => onGenerate?.(report)}
      >
        Generate Report
      </Button>
    </Card>
  );
}
