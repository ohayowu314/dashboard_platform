// src/types.tsx
import type { TableId } from "shared/types/dataTable";
import { VALIDATION_ERROR } from "./constants";

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
  rightPanelTitle?: React.ReactNode;
  rightPanelContent?: React.ReactNode;
  content: React.ReactNode;
}

export type EditorMode = "create" | "edit" | "upload" | null;
export interface CreateTableNavigateState {
  editorMode: "create";
}
export interface EditTableNavigateState {
  editorMode: "edit";
  tableId: TableId;
}
export interface UploadTableNavigateState {
  editorMode: "upload";
  file: File;
}
export type DataTableNavigateState =
  | CreateTableNavigateState
  | EditTableNavigateState
  | UploadTableNavigateState
  | null;

export type FileConflictAction = "rename" | "replace" | "skip";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = VALIDATION_ERROR;
  }
}
