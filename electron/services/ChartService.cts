import { FileManager } from "../models/FileManager.cjs";
import { ChartManager } from "../models/ChartManager.cjs";
import { DataTableManager } from "../models/DataTableManager.cjs";
import type {
  ChartInfo,
  ChartConfig,
  ChartWithData,
} from "shared/types/chart";

export const getAllCharts = (): ChartInfo[] => {
  return ChartManager.getAllCharts();
};

export const getChartById = (id: number): ChartWithData => {
  const chart = ChartManager.getChartById(id);
  if (!chart) throw new Error("圖表不存在");

  const configContent = FileManager.readFile(chart.config_path);
  const config: ChartConfig = JSON.parse(configContent);

  let data: Record<string, unknown>[] = [];
  if (chart.dataTableId) {
    const tableInfo = DataTableManager.getTableInfoById(chart.dataTableId);
    if (tableInfo) {
      const tableContent = FileManager.readFile(tableInfo.file_path);
      const parsed = JSON.parse(tableContent);
      data = parsed.rows || [];
    }
  }

  return { info: chart, config, data };
};

export const uploadChart = (
  chartInfo: { name: string; description?: string; dataTableId?: number },
  config: ChartConfig
): ChartInfo => {
  const { name, description, dataTableId } = chartInfo;
  const chartDirectory = FileManager.getUserDataPath(
    "charts",
    `${Date.now()}_${name}`
  );
  FileManager.ensureDirectory(chartDirectory);

  const configPath = FileManager.saveFile(
    chartDirectory,
    "config.json",
    config
  );
  const previewPath = FileManager.saveFile(
    chartDirectory,
    "preview.png",
    ""
  );

  return ChartManager.addChart({
    name,
    description,
    dataTableId,
    config_path: configPath,
    preview_path: previewPath,
  });
};

export const updateChart = (
  id: number,
  chartInfo: { name?: string; description?: string; dataTableId?: number },
  config: ChartConfig
): ChartInfo => {
  const chart = ChartManager.getChartById(id);
  if (!chart) throw new Error("圖表不存在");

  FileManager.saveFileWithPath(chart.config_path, config);

  return ChartManager.updateChart({
    id,
    name: chartInfo.name,
    description: chartInfo.description,
    dataTableId: chartInfo.dataTableId,
  });
};

export const deleteChart = (id: number) => {
  const chart = ChartManager.getChartById(id);
  if (!chart) throw new Error("圖表不存在");

  FileManager.deleteFile(chart.config_path);
  if (chart.preview_path) FileManager.deleteFile(chart.preview_path);
  ChartManager.deleteChart(id);

  return { message: "圖表已刪除" };
};

const chartService = {
  getAllCharts,
  getChartById,
  uploadChart,
  updateChart,
  deleteChart,
};

export default chartService;