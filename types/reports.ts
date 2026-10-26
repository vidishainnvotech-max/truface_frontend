export type ReportFrequency = "daily" | "weekly" | "monthly" | "on-demand";

export interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  frequency: string;
  lastGenerated: string;
}

export type ExportStatus = "ready" | "processing" | "failed";

export interface ExportRecord {
  id: string;
  filename: string;
  generatedBy: string;
  format: string;
  fileSize: string;
  status: ExportStatus;
}
