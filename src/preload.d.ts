// src/preload.d.ts
export {};
import type {
  TableId,
  DataTableHeaderSchema,
  DataTableInfo,
  DataTableWithInfo,
} from "shared/types/dataTable";
import type {
  Message,
  ConflictResult,
  UploadMode,
  UploadInputInfo,
} from "shared/types";
import type { ChartInfo } from "shared/types/chart";
interface DataTableAPI {
  uploadTable: (
    tableInfo: UploadInputInfo,
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
interface DashboardAPI {
  uploadDashboard: (
    dashboardInfo: UploadInputInfo,
    content: unknown,
    uploadMode: UploadMode
  ) => Promise<DataTableInfo>;
  getAllDashboardInfos: () => Promise<DataTableInfo[]>;
  checkDashboardNamesConflict: (names: string[]) => Promise<ConflictResult[]>;
  getDashboard: (id: TableId) => Promise<DataTableWithInfo>;
  deleteDashboard: (id: TableId) => Promise<Message>;
  updateDashboard: (
    id: TableId,
    name: string,
    data: unknown
  ) => Promise<DataTableWithInfo>;
}

declare global {
  interface Window {
    api: DataTableAPI & ChartAPI & DashboardAPI;
  }
}
