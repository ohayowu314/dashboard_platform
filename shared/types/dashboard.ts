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

export type BlockType = "text" | "chart" | "table";
export type BlockId = string;

export interface DashboardBlock {
  id: BlockId;
  type: BlockType;
  layout: BlockLayout;
  config: BlockConfig;
}

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

export type BlockConfig = TextBlockConfig | ChartBlockConfig | TableBlockConfig;

export interface TextBlockConfig {
  content: string;
  style?: TextBlockStyle;
}

export interface TextBlockStyle {
  fontSize?: number;
  fontWeight?: "normal" | "bold";
  textAlign?: "left" | "center" | "right";
  color?: string;
}

export interface ChartBlockConfig {
  chartId: number;
  title?: string;
  options?: ChartBlockOptions;
}

export interface ChartBlockOptions {
  showLegend?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
}

export interface TableBlockConfig {
  dataTableId: number;
  columns?: string[];
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
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