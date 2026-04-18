// src/hooks/useTableDataInitializer.tsx
import { useState, useEffect } from "react";
import type { DataTableHeaderSchema, TableId } from "shared/types/dataTable";
import type { EditorMode } from "../types";
import { useFileParser } from "./useFileParser";
import { useTableGetter } from "./useTableGetter";
import { getNameFromFile } from "../utils";

export interface DataTableState {
  data: DataTableHeaderSchema | null;
  name: string;
  id?: TableId | null;
}

export const useTableDataInitializer = (
  editorMode: EditorMode,
  tableId?: TableId,
  file?: File | null
) => {
  console.log("[useTableDataInitializer] 進入 hook, editorMode:", editorMode, "tableId:", tableId, "file:", file?.name);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<DataTableState | null>(null);
  const [initialized, setInitialized] = useState(false);

  const {
    loading: tableGettedLoading,
    info: tableGettedInfo,
    data: tableGettedData,
    error: tableGettedError,
  } = useTableGetter(tableId);

  const {
    loading: fileParsedLoading,
    data: fileParsedData,
    error: fileParsedError,
  } = useFileParser(file);

  useEffect(() => {
    if (initialized) {
      console.log("[useTableDataInitializer] 已初始化過，跳過");
      return;
    }
    console.log("[useTableDataInitializer] useEffect 觸發, editorMode:", editorMode, "initialized:", initialized);

    if (editorMode === "edit" && tableId && !tableGettedLoading) {
      console.log("[useTableDataInitializer] edit 模式處理, tableGettedInfo:", tableGettedInfo, "tableGettedData:", !!tableGettedData, "tableGettedError:", tableGettedError);
      if (tableGettedError) {
        setError(tableGettedError);
        setLoading(false);
        setInitialized(true);
        return;
      }
      setInitialState({
        data: tableGettedData,
        name: tableGettedInfo?.name || "未命名表格",
        id: tableId,
      });
      setLoading(false);
      setInitialized(true);
    } else if (editorMode === "upload" && file && !fileParsedLoading) {
      console.log("[useTableDataInitializer] upload 模式處理, fileParsedError:", fileParsedError, "fileParsedData:", !!fileParsedData);
      if (fileParsedError) {
        setError(fileParsedError);
        setLoading(false);
        setInitialized(true);
        return;
      }
      setInitialState({
        data: fileParsedData,
        name: file ? getNameFromFile(file.name) : "未命名表格",
        id: null,
      });
      setLoading(false);
      setInitialized(true);
    } else if (editorMode === "create") {
      console.log("[useTableDataInitializer] create 模式處理");
      setInitialState({
        data: { headers: ["Column 1"], rows: [[]] },
        name: "未命名表格",
        id: null,
      });
      setLoading(false);
      setInitialized(true);
    }
  }, [editorMode, tableId, file, tableGettedLoading, fileParsedLoading, tableGettedData, tableGettedInfo, tableGettedError, fileParsedData, fileParsedError, initialized]);

  console.log("[useTableDataInitializer] 返回, loading:", loading, "error:", error, "initialState:", !!initialState);
  return { loading, error, initialState };
};
