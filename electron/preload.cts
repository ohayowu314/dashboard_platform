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
import type { ChartInfo } from "shared/types/chart";

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
  uploadChart: (
    chartInfo: { name: string; description?: string },
    config: unknown
  ): Promise<ChartInfo> =>
    ipcRenderer.invoke("upload-chart", { chartInfo, config }),
  deleteChart: (id: number): Promise<Message> =>
    ipcRenderer.invoke("delete-chart", id),
});
console.log("Preload script end");
