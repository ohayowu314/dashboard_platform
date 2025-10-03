import { FileManager } from "../models/FileManager.cjs";
import { DataTableManager } from "../models/DataTableManager.cjs";
import { IpcMainListener } from "../types.cjs";
import {
  DataTableHeaderSchema,
  DataTableWithInfo,
  TableId,
  UploadInputDataTableInfo,
} from "shared/types/dataTable";
import { UploadMode } from "shared/types/index";

export const DataTableAPIHandlers: Record<string, IpcMainListener> = {
  // 上傳資料表
  "upload-table": async (
    _event,
    {
      tableInfo,
      content,
      uploadMode = "create",
    }: {
      tableInfo: UploadInputDataTableInfo;
      content: DataTableHeaderSchema;
      uploadMode: UploadMode;
    }
  ) => {
    const { name: originalName, description } = tableInfo;

    // 1. 檢查表格是否存在
    const existingRecord = DataTableManager.getTableInfoByName(originalName);

    let finalName: string = originalName;
    let filePath: string;
    const directory = FileManager.getUserDataPath("tables");

    // 2. 處理衝突和模式邏輯
    if (existingRecord) {
      // 發現衝突
      if (uploadMode === "create") {
        // 這是來自前端的 "rename" 操作 (因為前端將 rename 視為創建新表格)
        // 計算一個新的、不重複的名稱，例如 'users_1'
        finalName = DataTableManager.getNewTableName(originalName);
        console.log(`Table name conflict, renamed to: ${finalName}`);

        // 儲存新檔案並建立新的資料庫記錄
        const fileName = `${Date.now()}_${finalName}.json`;
        filePath = FileManager.saveFile(directory, fileName, content);

        return DataTableManager.addTableInfo({
          name: finalName,
          description,
          file_path: filePath,
        });
      } else if (uploadMode === "replace") {
        // 這是來自前端的 "replace" 操作
        console.log(`Table ${originalName} exists, replacing content.`);

        // A. 替換/更新檔案內容 (保持原有的 file_path)
        filePath = existingRecord.file_path;
        FileManager.saveFileWithPath(filePath, content); // 假設 saveFile 支援使用完整路徑和覆蓋模式

        // B. 更新資料庫記錄 (只更新 updated_at 和 description)
        // 注意：這裡我們假設 content 的內容已經被寫入到現有檔案路徑，
        //      並且只更新 description（如果前端有傳遞新的 description）
        return DataTableManager.updateTableInfo({
          id: existingRecord.id, // 使用 ID 進行更新
          name: originalName, // 名稱不變
          description, // 更新 description
          // file_path 也不變
        });
      }

      // 如果存在但 uploadMode 既不是 'create' 也不是 'replace' (例如 'skip'，但 skip 應該在前端被過濾)
      // 這裡可以拋出錯誤或返回 null，但由於前端已過濾 skip，通常不會發生。
      throw new Error(
        `Conflict for ${originalName} with unsupported mode ${uploadMode}.`
      );
    }

    // 3. 沒有衝突：執行標準的 'create' 操作
    // 注意：即使 uploadMode 為 'replace'，如果沒有 existingRecord，也必須執行 'create'

    // 儲存新檔案
    const fileName = `${Date.now()}_${originalName}.json`;
    filePath = FileManager.saveFile(directory, fileName, content);

    // 建立新的資料庫記錄
    return DataTableManager.addTableInfo({
      name: finalName,
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
  "check-table-conflict": (_event, name: string) => ({
    name,
    isConflict: DataTableManager.checkSingleTableNameExist(name),
  }),
  "check-tables-conflict": (_event, names: string[]) => {
    const existingRecords = DataTableManager.checkTableNamesExist(names);
    return names.map((name) => ({
      name,
      isConflict: existingRecords.includes(name),
    }));
  },
};
