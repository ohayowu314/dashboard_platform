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
  ChartInfo,
  ChartConfig,
  ChartWithData,
} from "../shared/types/chart";
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

interface ChartAPI {
  getAllCharts: () => Promise<ChartInfo[]>;
  getChart: (id: number) => Promise<ChartWithData>;
  uploadChart: (
    chartInfo: { name: string; description?: string; dataTableId?: number },
    config: ChartConfig
  ) => Promise<ChartInfo>;
  updateChart: (
    id: number,
    chartInfo: { name?: string; description?: string; dataTableId?: number },
    config: ChartConfig
  ) => Promise<ChartInfo>;
  deleteChart: (id: number) => Promise<Message>;
}

interface DashboardAPI {
  getAllDashboards: () => Promise<DashboardInfo[]>;
  getDashboard: (id: number) => Promise<DashboardWithConfig>;
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
    api: DataTableAPI & ChartAPI & DashboardAPI;
  }
}