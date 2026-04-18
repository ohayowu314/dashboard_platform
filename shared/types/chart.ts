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
export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "histogram"
  | "area";

export interface ChartConfig {
  title: string;
  type: ChartType;
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

export interface ChartInfoWithConfig {
  info: ChartInfo;
  config: ChartConfig;
}

export interface ChartWithData extends ChartInfoWithConfig {
  data: Record<string, unknown>[];
}

