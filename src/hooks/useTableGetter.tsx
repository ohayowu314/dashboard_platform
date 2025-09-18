// src/hooks/useTableGetter.ts
import { useState, useEffect } from "react";
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
  tableId: TableId | undefined
): useTableGetterReturn => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<DataTableInfo | null>(null);
  const [data, setData] = useState<DataTableHeaderSchema | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gettingDataTable = async () => {
      if (!tableId) {
        setError("無表格資料。請返回資料表格列表頁重新選擇。");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const dataTableWithInfo = await getDataTableWithInfo(tableId);
        setInfo(dataTableWithInfo.info);
        setData(dataTableWithInfo.data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("取得表格時發生未知錯誤");
        }
      } finally {
        setLoading(false);
      }
    };

    gettingDataTable();
  }, [tableId]);

  return { loading, info, data, error };
};
