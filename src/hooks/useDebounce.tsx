// src/hooks/useDebounce.tsx
import { useState, useEffect } from "react";

/**
 * useDebounce Hook
 *
 * 在指定的延遲時間內，限制 value 的更新頻率。
 * 只有當 value 在 delay 毫秒內沒有變化時，才會更新 debouncedValue。
 *
 * @param value 任何類型的值 (例如字串、陣列)，當它改變時會觸發 debounce 計時器。
 * @param delay 延遲時間，單位為毫秒 (ms)。
 * @returns 經過 debounce 處理後的值。
 */
export function useDebounce<T>(value: T, delay: number): T {
  // 1. 儲存經過延遲後才會更新的值
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. 設定一個新的計時器
    const handler = setTimeout(() => {
      // 延遲時間到後，將最新的 value 設定給 debouncedValue
      setDebouncedValue(value);
    }, delay);

    // 3. 清理函數 (Cleanup Function)
    // 在下一次 useEffect 執行前（即 value 再次改變時）或元件卸載時，
    // 清除上一次設定的計時器。
    // 這是 debounce 邏輯的核心：如果計時器還沒跑完 value 又變了，就重設。
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 依賴於傳入的 value 和 delay

  return debouncedValue;
}
