import chartService from "../services/ChartService.cjs";
import { IpcMainListener } from "../types.cjs";
import { ChartInfo } from "shared/types/chart";

export const ChartAPIHandlers: Record<string, IpcMainListener> = {
  // 上傳圖表設定檔
  "upload-chart": (
    _event,
    { chartInfo, config }: { chartInfo: ChartInfo; config: unknown }
  ) => chartService.uploadChart(chartInfo, config),
  // 刪除圖表
  "delete-chart": (_event, id: number) => chartService.deleteChart(id),
};
