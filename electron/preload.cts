console.log("Preload script loaded");
import { contextBridge, ipcRenderer } from "electron";
import type { Message } from "shared/types";
import type {
  DataTableHeaderSchema,
  DataTableInfo,
  DataTableWithInfo,
  TableId,
} from "shared/types/dataTable";
import type { ChartInfo } from "shared/types/chart";

contextBridge.exposeInMainWorld("api", {
  uploadTable: (
    tableInfo: { name: string; description?: string },
    content: DataTableHeaderSchema
  ): Promise<DataTableInfo> =>
    ipcRenderer.invoke("upload-table", { tableInfo, content }),
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
  uploadChart: (
    chartInfo: { name: string; description?: string },
    config: unknown
  ): Promise<ChartInfo> =>
    ipcRenderer.invoke("upload-chart", { chartInfo, config }),
  deleteChart: (id: number): Promise<Message> =>
    ipcRenderer.invoke("delete-chart", id),
});
console.log("Preload script end");
