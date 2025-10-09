import { FileManager } from "../models/FileManager.cjs";
import { ChartManager } from "../models/ChartManager.cjs";
import { ChartInfo } from "shared/types/chart";
export const uploadChart = (chartInfo: ChartInfo, config: unknown) => {
  const { name, description } = chartInfo;
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
  const previewPath = FileManager.saveFile(chartDirectory, "preview.png", ""); // 空檔案占位

  return ChartManager.addChart({
    name,
    description,
    config_path: configPath,
    preview_path: previewPath,
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
  uploadChart,
  deleteChart,
} as const;
export default chartService;
