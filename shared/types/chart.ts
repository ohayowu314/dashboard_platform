import type { TableId } from "./dataTable";

export interface ChartInfo {
  id: number;
  name: string;
  description?: string;
  dataTableId?: TableId;
  config_path: string;
  preview_path?: string;
  created_at: string;
  updated_at: string;
}
export type ChartId = ChartInfo["id"];
export type ChartName = ChartInfo["name"];
export type ChartTypeName =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "histogram"
  | "area";

export interface ChartConfig {
  title: string;
  type: ChartTypeName;
  xAxis: string;
  yAxis: string | string[];
  series?: string[];
  options?: ChartOptions;
}

export interface ChartOptions {
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  animation?: boolean;
  stacking?: boolean;
}

export interface ChartWithConfig {
  info: ChartInfo;
  config: ChartConfig;
}

export interface ChartWithPreview extends ChartWithConfig {
  previewPath?: string;
}

export interface ChartWithData extends ChartWithConfig {
  data: Record<string, unknown>[];
}

export interface ChartWithDataAndPreview extends ChartWithData {
  previewPath?: string;
}

export type ChartType =
  | ChartWithConfig
  | ChartWithData
  | ChartWithPreview
  | ChartWithDataAndPreview;
