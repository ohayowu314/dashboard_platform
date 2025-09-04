// src/types.tsx
export interface TocItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: TocItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface PageConfig {
  tocItems: TocItem[];
  breadcrumbItems: BreadcrumbItem[];
  rightPanelContent?: React.ReactNode;
  content: React.ReactNode;
}

export type ColumnType = "string" | "number" | "boolean" | "date";
export interface ColumnInfo {
  name: string;
  desc?: string;
  type: ColumnType;
}

export interface DataTableInfo {
  id: string;
  name: string;
  uploadDate: string;
  fileSize?: string | number;
  columnInfos?: ColumnInfo[];
}

export type DataType = string | number | boolean | null | undefined;
export type DataRow = Record<string, DataType>;
export type DataTable = DataRow[];

export interface ParsedData {
  headers: string[];
  rows: (string | number)[][];
}

export interface DataTableWithInfo {
  info: DataTableInfo;
  data: DataTable;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export class Ok<T, _> {
  readonly type = "ok" as const;
  constructor(public value: T) {}
}

export class Err<_, E> {
  readonly type = "err" as const;
  constructor(public error: E) {}
}
