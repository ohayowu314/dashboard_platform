import type { FileInfo } from ".";

export type SupportedFileType = "json";
export type FileType = SupportedFileType | "unknown";
export type DashboardInfo = FileInfo & {
  chartCount: number;
};
export type DashboardId = DashboardInfo["id"];
