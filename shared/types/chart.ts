export type ChartType =
  | "table"
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "histogram"
  | "area";

export interface ChartDisplayOptions {
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  animation?: boolean;
  stacking?: boolean;
}

export interface ChartWithData {
  data: Record<string, unknown>[];
}

