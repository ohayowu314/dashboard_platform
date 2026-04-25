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
} from "../shared/types/dataTable";
import type {
  DashboardInfo,
  DashboardConfig,
  DashboardWithConfig,
} from "../shared/types/dashboard";

interface DataTableAPI {
  uploadTable: (
    tableInfo: UploadInputInfo,
    content: DataTableHeaderSchema,
    uploadMode: UploadMode
  ) => Promise<DataTableInfo>;
  getAllTableInfos: () => Promise<DataTableInfo[]>;
  getTable: (id: TableId) => Promise<DataTableWithInfo>;
  updateTable: (
    id: TableId,
    name: string,
    data: DataTableHeaderSchema
  ) => Promise<DataTableWithInfo>;
  deleteTable: (id: TableId) => Promise<Message>;
  checkTableConflict: (name: string) => Promise<ConflictResult>;
  checkTablesConflict: (names: string[]) => Promise<ConflictResult[]>;
}

interface DashboardAPI {
  getAllDashboards: () => Promise<DashboardInfo[]>;
  getDashboard: (id: number) => Promise<DashboardWithConfig>;
  getDashboardDraft: (id: number) => Promise<DashboardWithConfig>;
  saveDashboardDraft: (id: number, config: DashboardConfig) => Promise<void>;
  deleteDashboardDraft: (id: number) => Promise<void>;
  createDashboard: (
    name: string,
    description: string | undefined,
    config: DashboardConfig
  ) => Promise<DashboardWithConfig>;
  updateDashboard: (
    id: number,
    name: string,
    description: string | undefined,
    config: DashboardConfig
  ) => Promise<DashboardWithConfig>;
  deleteDashboard: (id: number) => Promise<Message>;
  checkDashboardConflict: (name: string) => Promise<ConflictResult>;
}

declare global {
  interface Window {
    api: DataTableAPI & DashboardAPI;
  }
}