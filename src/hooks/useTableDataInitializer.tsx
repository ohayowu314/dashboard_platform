// src/hooks/useTableDataInitializer.tsx
import { useState, useEffect } from "react";
import { useFileParser } from "./useFileParser";
import { useTableGetter } from "./useTableGetter";
import type { DataTableHeaderSchema, TableId } from "shared/types/dataTable";
import type { EditorMode } from "src/types";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<DataTableState | null>(null);

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
    const initializeData = () => {
      setLoading(true);
      setError(null);

      if (editorMode === "edit" && !tableGettedLoading) {
        if (tableGettedError) {
          setError(tableGettedError);
        } else if (tableGettedData) {
          setInitialState({
            data: tableGettedData,
            name: tableGettedInfo?.name || "未命名表格",
            id: tableId,
          });
        }
        setLoading(false);
      } else if (editorMode === "upload" && !fileParsedLoading) {
        if (fileParsedError) {
          setError(fileParsedError);
        } else if (fileParsedData) {
          setInitialState({
            data: fileParsedData,
            name: file?.name.split(".")[0] || "未命名表格",
            id: null,
          });
        }
        setLoading(false);
      } else if (editorMode === "create") {
        setInitialState({
          data: { headers: ["Column 1"], rows: [[]] },
          name: "未命名表格",
          id: null,
        });
        setLoading(false);
      }
    };

    initializeData();
  }, [
    editorMode,
    tableId,
    file,
    tableGettedLoading,
    fileParsedLoading,
    tableGettedData,
    tableGettedInfo,
    tableGettedError,
    fileParsedData,
    fileParsedError,
  ]);

  return { loading, error, initialState };
};
