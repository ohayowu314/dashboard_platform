import type { FileInfo } from ".";

export type SupportedFileType = "csv" | "json";
export type FileType = SupportedFileType | "unknown";
export type ColumnType = "string" | "number" | "boolean" | "date";
export interface ColumnInfo {
  name: string;
  desc?: string;
  type: ColumnType;
}
export type DataTableInfo = FileInfo & {
  columnInfos?: ColumnInfo[];
};
export type TableId = DataTableInfo["id"];

export type DataValue = string | number | boolean | null | undefined;
export type DataRecord = Record<string, DataValue>;
export type DataRow = DataValue[];
export type DataTableRecordSchema = DataRecord[];
export type DataTableHeader = string;
export interface DataTableHeaderSchema {
  headers: DataTableHeader[];
  rows: DataRow[];
}
export interface DataTableWithInfo {
  info: DataTableInfo;
  data: DataTableHeaderSchema;
}
