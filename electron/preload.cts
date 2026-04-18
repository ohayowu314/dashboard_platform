console.log("Preload script loaded");
import { contextBridge, ipcRenderer } from "electron";
import type {
  ConflictResult,
  Message,
  UploadMode,
  UploadInputInfo,
} from "../shared/types";
import type {
  DataTableHeaderSchema,
  DataTableInfo,
  DataTableWithInfo,
  TableId,
} from "shared/types/dataTable";
import type {
  ChartInfo,
  ChartConfig,
  ChartWithData,
} from "shared/types/chart";
import type {
  DashboardInfo,
  DashboardConfig,
  DashboardWithConfig,
} from "shared/types/dashboard";

contextBridge.exposeInMainWorld("api", {
  uploadTable: (
    tableInfo: UploadInputInfo,
    content: DataTableHeaderSchema,
    uploadMode: UploadMode = "create"
  ): Promise<DataTableInfo> =>
    ipcRenderer.invoke("upload-table", { tableInfo, content, uploadMode }),
  getAllTableInfos: (): Promise<DataTableInfo[]> =>
    ipcRenderer.invoke("get-all-table-infos"),
  getTable: (id: TableId): Promise<DataTableWithInfo> =>
    ipcRenderer.invoke("get-table", id),
  updateTable: (
    id: TableId,
    name: string,
    data: DataTableHeaderSchema
  ): Promise<DataTableWithInfo> =>
    ipcRenderer.invoke("update-table", { id, name, data }),
  deleteTable: (id: TableId): Promise<Message> =>
    ipcRenderer.invoke("delete-table", id),
  checkTableConflict: (name: string): Promise<ConflictResult> =>
    ipcRenderer.invoke("check-table-conflict", name),
  checkTablesConflict: (names: string[]): Promise<ConflictResult[]> =>
    ipcRenderer.invoke("check-tables-conflict", names),

  getAllCharts: (): Promise<ChartInfo[]> =>
    ipcRenderer.invoke("get-all-charts"),
  getChart: (id: number): Promise<ChartWithData> =>
    ipcRenderer.invoke("get-chart", id),
  uploadChart: (
    chartInfo: { name: string; description?: string; dataTableId?: number },
    config: ChartConfig
  ): Promise<ChartInfo> =>
    ipcRenderer.invoke("upload-chart", { chartInfo, config }),
  updateChart: (
    id: number,
    chartInfo: { name?: string; description?: string; dataTableId?: number },
    config: ChartConfig
  ): Promise<ChartInfo> =>
    ipcRenderer.invoke("update-chart", { id, chartInfo, config }),
  deleteChart: (id: number): Promise<Message> =>
    ipcRenderer.invoke("delete-chart", id),

  getAllDashboards: (): Promise<DashboardInfo[]> =>
    ipcRenderer.invoke("get-all-dashboards"),
  getDashboard: (id: number): Promise<DashboardWithConfig> =>
    ipcRenderer.invoke("get-dashboard", id),
  createDashboard: (
    name: string,
    description: string | undefined,
    config: DashboardConfig
  ): Promise<DashboardWithConfig> =>
    ipcRenderer.invoke("create-dashboard", { name, description, config }),
  updateDashboard: (
    id: number,
    name: string,
    description: string | undefined,
    config: DashboardConfig
  ): Promise<DashboardWithConfig> =>
    ipcRenderer.invoke("update-dashboard", {
      id,
      name,
      description,
      config,
    }),
  deleteDashboard: (id: number): Promise<Message> =>
    ipcRenderer.invoke("delete-dashboard", id),
  checkDashboardConflict: (name: string): Promise<ConflictResult> =>
    ipcRenderer.invoke("check-dashboard-conflict", name),
});
console.log("Preload script end");