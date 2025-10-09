import dataTableService from "../services/DataTableService.cjs";
import { IpcMainListener } from "../types.cjs";
import {
  DataTableHeaderSchema,
  DataTableWithInfo,
  TableId,
} from "shared/types/dataTable";
import { UploadInputInfo, UploadMode } from "shared/types/index";

export const DataTableAPIHandlers: Record<string, IpcMainListener> = {
  // 上傳資料表
  "upload-table": (
    _event,
    {
      tableInfo,
      content,
      uploadMode = "create",
    }: {
      tableInfo: UploadInputInfo;
      content: DataTableHeaderSchema;
      uploadMode: UploadMode;
    }
  ) => dataTableService.uploadTable(tableInfo, content, uploadMode),
  // 取得所有資料表資訊
  "get-all-table-infos": () => dataTableService.getAllTableInfos(),
  // 取得單一資料表
  "get-table": (_event, id: TableId): DataTableWithInfo =>
    dataTableService.getTableById(id),
  // 更新資料表
  "update-table": (
    _event,
    {
      id,
      name,
      data,
    }: { id: TableId; name: string; data: DataTableHeaderSchema }
  ): DataTableWithInfo => dataTableService.updateTable(id, name, data),
  // 刪除資料表
  "delete-table": (_event, id: TableId) => dataTableService.deleteTable(id),
  "check-table-conflict": (_event, name: string) =>
    dataTableService.checkConflict(name),
  "check-tables-conflict": (_event, names: string[]) =>
    dataTableService.checkConflicts(names),
};
