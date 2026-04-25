// src/hooks/useTableGetter.ts
import { useCallback, useEffect } from "react";
import { useAsyncOperation } from "./internal/useAsyncOperation";
import { getDataTableWithInfo } from "../utils";
import type {
  DataTableHeaderSchema,
  DataTableInfo,
  TableId,
} from "shared/types/dataTable";

interface useTableGetterReturn {
  loading: boolean;
  info: DataTableInfo | null;
  data: DataTableHeaderSchema | null;
  error: string | null;
}

export const useTableGetter = (
  tableId: TableId | undefined,
): useTableGetterReturn => {
  console.log("[useTableGetter] 進入 hook, tableId:", tableId);
  const fetcher = useCallback(() => {
    if (!tableId) return Promise.resolve(null);
    return getDataTableWithInfo(tableId);
  }, [tableId]);

  const { loading, data: dataTableWithInfo, error, execute } = useAsyncOperation(fetcher, null);


  useEffect(() => {
    console.log("[useTableGetter] useEffect 觸發, tableId:", tableId);
    if (tableId) {
      execute();
    }
  }, [tableId, execute]);

  const displayError =
    !tableId && !loading ? "無表格資料。請返回資料表格列表頁重新選擇。" : error;
  console.log("[useTableGetter] getDataTableWithInfo 完成, info:", dataTableWithInfo?.info, "data:", !!dataTableWithInfo?.data);
  return { loading, info: dataTableWithInfo?.info || null, data: dataTableWithInfo?.data || null, error: displayError };
};
