// src/hooks/useFileParser.ts
import { useCallback, useEffect } from "react";
import { useAsyncOperation } from "./internal/useAsyncOperation";
import { parseDataFile } from "../utils";
import type { DataTableHeaderSchema } from "shared/types/dataTable";

interface UseFileParserReturn {
  loading: boolean;
  data: DataTableHeaderSchema | null;
  error: string | null;
}

export const useFileParser = (
  file: File | null | undefined,
): UseFileParserReturn => {
  console.log("[useFileParser] 進入 hook, file:", file?.name);
  const fetcher = useCallback(() => {
    if (!file) return Promise.resolve(null);
    return parseDataFile(file);
  }, [file]);

  const { loading, data, error, execute } = useAsyncOperation(fetcher, null);

  useEffect(() => {
    console.log("[useFileParser] useEffect 觸發, file:", file?.name);
    if (file) {
      execute();
    }
  }, [file, execute]);

  const displayError =
    !file && !loading ? "無檔案資料。請返回資料表格列表頁重新上傳。" : error;

  return {
    loading,
    data,
    error: displayError,
  };
};
