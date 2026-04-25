import type { ChartType, ChartDisplayOptions } from "./chart";

export type SupportedFileType = "json";
export type FileType = SupportedFileType | "unknown";

export interface DashboardInfo {
  id: number;
  name: string;
  description?: string;
  config_path: string;
  preview_path?: string;
  created_at: string;
  updated_at: string;
}
export type DashboardId = DashboardInfo["id"];

export interface BlockLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

export interface BaseChartBlockConfig {
  id: string;
  title?: string;
  description?: string;
  dataTableId: number;
}

export interface TableChartBlockConfig extends BaseChartBlockConfig {
  chartType: "table";
  columns?: string[];
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface ChartChartBlockConfig extends BaseChartBlockConfig {
  chartType: Exclude<ChartType, "table">;
  xAxis: string;
  yAxis: string | string[];
  options?: ChartDisplayOptions;
}

export type ChartBlockConfig = TableChartBlockConfig | ChartChartBlockConfig;

export interface DashboardBlock {
  id: string;
  layout: BlockLayout;
  config: ChartBlockConfig;
}

export interface DashboardConfig {
  title: string;
  description?: string;
  blocks: DashboardBlock[];
  settings?: DashboardSettings;
}

export interface DashboardSettings {
  columns: number;
  rowHeight: number;
  background?: string;
}

export interface DashboardWithConfig {
  info: DashboardInfo;
  config: DashboardConfig;
}