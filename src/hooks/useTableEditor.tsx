// src/hooks/useTableEditor.tsx
import { useState } from "react";
import type {
  DataTableHeaderSchema,
  DataTableHeader,
  DataValue,
} from "shared/types/dataTable";

interface UseTableEditorReturn {
  tableName: string;
  setTableName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (editing: boolean) => void;
  data: DataTableHeaderSchema | null;
  handleCellChange: (
    rowIndex: number,
    colIndex: number,
    newValue: DataValue
  ) => void;
  updateData: (newData: DataTableHeaderSchema | null) => void;
  handleHeaderChange: (colIndex: number, newHeader: DataTableHeader) => void;
}

export const useTableEditor = (
  initialData: DataTableHeaderSchema | null,
  initialName: string
): UseTableEditorReturn => {
  console.log("[useTableEditor] 進入 hook, initialData:", !!initialData, "initialName:", initialName);
  const [tableName, setTableName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [data, setData] = useState<DataTableHeaderSchema | null>(null);

  const [prevTableName, setPrevTableName] = useState(initialName);
  const [prevData, setPrevData] = useState<DataTableHeaderSchema | null>(initialData);
  if (initialName !== prevTableName) {
    setPrevTableName(initialName);
    setTableName(initialName);
  }
  if (JSON.stringify(initialData) !== JSON.stringify(prevData)) {
    setPrevData(initialData);
    setData(initialData);
  }

  const updateData = (newData: DataTableHeaderSchema | null) => {
    console.log("[useTableEditor] updateData 呼叫, newData:", !!newData);
    setData(newData);
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    newValue: DataValue
  ) => {
    console.log("[useTableEditor] handleCellChange, rowIndex:", rowIndex, "colIndex:", colIndex, "newValue:", newValue);
    if (!data) return;
    const newRows = data.rows.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => (cIdx === colIndex ? newValue : cell))
        : row
    );
    setData({ ...data, rows: newRows });
  };

  const handleHeaderChange = (colIndex: number, newHeader: DataTableHeader) => {
    if (!data) return;
    const newHeaders = [...data.headers];
    newHeaders[colIndex] = newHeader;
    setData({ ...data, headers: newHeaders });
  };

  return {
    tableName,
    setTableName,
    isEditingName,
    setIsEditingName,
    data,
    updateData,
    handleCellChange,
    handleHeaderChange,
  };
};
