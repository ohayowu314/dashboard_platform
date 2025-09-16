export interface ChartInfo {
  id: number;
  name: string;
  description?: string;
  config_path: string;
  preview_path?: string;
  created_at: string;
  updated_at: string;
}
export interface ChartConfig {
  title: string;
  type: "bar" | "line" | "pie" | "scatter" | "histogram";
  xAxis: string;
  yAxis: string;
  series?: string[];
  options?: Record<string, unknown>;
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
export type ChartTypeName = ChartType["info"]["name"];
