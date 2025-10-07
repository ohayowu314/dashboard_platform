// src/preload.d.ts
export {};
import type {
  TableId,
  DataTableHeaderSchema,
  DataTableInfo,
  DataTableWithInfo,
  UploadInputDataTableInfo,
} from "shared/types/dataTable";
import type { Message, ConflictResult, UploadMode } from "shared/types";
import type { ChartInfo } from "shared/types/chart";
interface DataTableAPI {
  uploadTable: (
    tableInfo: UploadInputDataTableInfo,
    content: DataTableHeaderSchema,
    uploadMode: UploadMode
  ) => Promise<DataTableInfo>;
  getAllTableInfos: () => Promise<DataTableInfo[]>;
  checkTablesConflict: (names: string[]) => Promise<ConflictResult[]>;
  getTable: (id: TableId) => Promise<DataTableWithInfo>;
  deleteTable: (id: TableId) => Promise<Message>;
  updateTable: (
    id: TableId,
    name: string,
    data: DataTableHeaderSchema
  ) => Promise<DataTableWithInfo>;
}

interface ChartAPI {
  uploadChart: (
    chartInfo: { name: string; description?: string },
    config: unknown
  ) => Promise<ChartInfo>;
  deleteChart: (id: number) => Promise<Message>;
}

declare global {
  interface Window {
    api: DataTableAPI & ChartAPI;
  }
}
