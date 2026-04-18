// src/hooks/internal/useAsyncOperation.ts
import { useState, useCallback } from "react";

export interface UseAsyncOperationResult<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  execute: () => Promise<void>;
}

export function useAsyncOperation<T>(
  fetcher: () => Promise<T>,
  defaultValue: T | null = null,
): UseAsyncOperationResult<T> {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T | null>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  return { loading, data, error, execute };
}
