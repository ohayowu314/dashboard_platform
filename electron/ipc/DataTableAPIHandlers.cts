import { FileManager } from "../models/FileManager.cjs";
import { DataTableManager } from "../models/DataTableManager.cjs";
import { IpcMainListener } from "../types.cjs";
import { DataTable, DataTableInfo } from "shared/types/dataTable";

export const DataTableAPIHandlers: Record<string, IpcMainListener> = {
  // 上傳資料表
  "upload-table": async (
    _event,
    {
      tableInfo,
      content,
    }: { tableInfo: { name: string; description?: string }; content: DataTable }
  ) => {
    const { name, description } = tableInfo;
    const directory = FileManager.getUserDataPath("tables");

    const fileName = `${Date.now()}_${name}.json`;
    const filePath = FileManager.saveFile(directory, fileName, content);

    return DataTableManager.addTableInfo({
      name,
      description,
      file_path: filePath,
    });
  },
  // 取得所有資料表資訊
  "get-all-table-infos": () => DataTableManager.getAllTableInfos(),
  // 取得單一資料表
  "get-table": (
    _event,
    id: number
  ): { info: DataTableInfo; data: DataTable } => {
    const tableInfo = DataTableManager.getTableInfoById(id);
    if (!tableInfo) throw new Error("資料表不存在");

    const content = FileManager.readFile(tableInfo.file_path);
    const data: DataTable = JSON.parse(content);

    return { info: tableInfo, data };
  },
  // 刪除資料表
  "delete-table": (_event, id: number) => {
    const table = DataTableManager.getTableInfoById(id);
    if (!table) throw new Error("資料表不存在");

    FileManager.deleteFile(table.file_path);
    DataTableManager.deleteTableInfo(id);

    return { message: "資料表已刪除" };
  },
};
