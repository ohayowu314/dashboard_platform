// src/hooks/useTableDataInitializer.tsx
import { useState, useEffect } from "react";
import type { DataTableHeaderSchema, TableId } from "shared/types/dataTable";
import type { EditorMode } from "../types";
import { useTableGetter } from "./useTableGetter";
import { getNameFromFile, parseDataFile } from "../utils";

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

  const {
    loading: tableGettedLoading,
    info: tableGettedInfo,
    data: tableGettedData,
    error: tableGettedError,
  } = useTableGetter(tableId);

  useEffect(() => {
    console.log("[useTableDataInitializer] useEffect 觸發, editorMode:", editorMode);
    async function init() {
      setLoading(true);
      try {
        if (editorMode === "edit" && tableId) {
          console.log("[useTableDataInitializer] edit 模式處理, tableGettedInfo:", tableGettedInfo, "tableGettedData:", !!tableGettedData, "tableGettedError:", tableGettedError);
          if (tableGettedLoading) return;
          if (tableGettedError) {
            setError(tableGettedError);
          } else {
            setInitialState({
              data: tableGettedData,
              name: tableGettedInfo?.name || "未命名表格",
              id: tableId,
            });
          }
        } else if (editorMode === "upload" && file) {
          console.log("[useTableDataInitializer] upload 模式處理, file:", file);
          const parsedData = await parseDataFile(file);
          setInitialState({
            data: parsedData,
            name: getNameFromFile(file.name),
            id: null,
          });
        } else if (editorMode === "create") {
          console.log("[useTableDataInitializer] create 模式處理");
          setInitialState({
            data: { headers: ["Column 1"], rows: [[]] },
            name: "未命名表格",
            id: null,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "載入失敗");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [editorMode, tableId, file, tableGettedLoading, tableGettedData, tableGettedInfo, tableGettedError]);

  console.log("[useTableDataInitializer] 返回, loading:", loading, "error:", error, "initialState:", !!initialState);
  return { loading, error, initialState };
};
