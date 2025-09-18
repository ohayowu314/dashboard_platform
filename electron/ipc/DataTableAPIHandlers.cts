import { FileManager } from "../models/FileManager.cjs";
import { DataTableManager } from "../models/DataTableManager.cjs";
import { IpcMainListener } from "../types.cjs";
import {
  DataTableHeaderSchema,
  DataTableWithInfo,
  TableId,
} from "shared/types/dataTable";

export const DataTableAPIHandlers: Record<string, IpcMainListener> = {
  // 上傳資料表
  "upload-table": async (
    _event,
    {
      tableInfo,
      content,
    }: {
      tableInfo: { name: string; description?: string };
      content: DataTableHeaderSchema;
    }
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
  "get-table": (_event, id: TableId): DataTableWithInfo => {
    const tableInfo = DataTableManager.getTableInfoById(id);
    if (!tableInfo) throw new Error("資料表不存在");

    const content = FileManager.readFile(tableInfo.file_path);
    const data: DataTableHeaderSchema = JSON.parse(content);

    return { info: tableInfo, data };
  },
  // 更新資料表
  "update-table": (
    _event,
    {
      id,
      name,
      data,
    }: { id: TableId; name: string; data: DataTableHeaderSchema }
  ): DataTableWithInfo => {
    const tableInfo = DataTableManager.getTableInfoById(id);
    if (!tableInfo) throw new Error("資料表不存在");

    // 更新檔案內容
    FileManager.saveFileWithPath(tableInfo.file_path, data);

    // 更新資料表資訊
    const updatedTable = DataTableManager.updateTableInfo({ id, name });
    if (!updatedTable) throw new Error("資料表更新失敗");

    return { info: updatedTable, data };
  },
  // 刪除資料表
  "delete-table": (_event, id: TableId) => {
    const table = DataTableManager.getTableInfoById(id);
    if (!table) throw new Error("資料表不存在");

    FileManager.deleteFile(table.file_path);
    DataTableManager.deleteTableInfo(id);

    return { message: "資料表已刪除" };
  },
};
