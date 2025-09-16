export type ColumnType = "string" | "number" | "boolean" | "date";
export interface ColumnInfo {
  name: string;
  desc?: string;
  type: ColumnType;
}

export interface DataTableInfo {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  fileSize?: string | number;
  columnInfos?: ColumnInfo[];
}

export type DataType = string | number | boolean | null | undefined;
export type DataRow = Record<string, DataType>;
export type DataTable = DataRow[];

export interface DataTableWithInfo {
  info: DataTableInfo;
  data: DataTable;
}
