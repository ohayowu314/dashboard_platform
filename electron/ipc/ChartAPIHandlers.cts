import chartService from "../services/ChartService.cjs";
import { IpcMainListener } from "../types.cjs";
import type { ChartInfo, ChartConfig } from "shared/types/chart";

interface UploadChartInput {
  chartInfo: { name: string; description?: string; dataTableId?: number };
  config: ChartConfig;
}

interface UpdateChartInput {
  id: number;
  chartInfo: { name?: string; description?: string; dataTableId?: number };
  config: ChartConfig;
}

export const ChartAPIHandlers: Record<string, IpcMainListener> = {
  "get-all-charts": () => chartService.getAllCharts(),

  "get-chart": (_event, id: number) => chartService.getChartById(id),

  "upload-chart": (
    _event,
    { chartInfo, config }: UploadChartInput
  ) => chartService.uploadChart(chartInfo, config),

  "update-chart": (
    _event,
    { id, chartInfo, config }: UpdateChartInput
  ) => chartService.updateChart(id, chartInfo, config),

  "delete-chart": (_event, id: number) => chartService.deleteChart(id),
};