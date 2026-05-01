# Gemini CLI 專案開發規範

## 1. IPC 通訊與狀態管理規範

**【核心原則：Hook First】**
在本專案中，與 Electron 主進程（IPC）的通訊必須優先考慮使用 **React Query Hooks**（位於 `@src/hooks/queries/**`）。除非有明確的技術限制，否則禁止在 React 元件中直接調用 `window.api`。

### 評估流程
當需要調用 `window.api` 時，必須遵循以下路徑：

1.  **檢查現有 Hooks**：優先搜索 `@src/hooks/queries/`，若已有對應 Hook（如 `useDashboard`, `useAllTableInfos`），必須優先使用。
2.  **評估新增 Hooks**：若需新增 API 調用且環境為 React 元件或 Hook，必須在 `queries` 目錄下新增對應的 Hook（讀取用 `useQuery`，寫入用 `useMutation`）。
3.  **例外處理**：
    *   **不適合場景**：純工具函數 (`src/utils.tsx`)、Zustand Store 內部 Action、React 生命週期外的邏輯。
    *   **要求**：若直接調用 `window.api`，須簡短說明原因（例如：「處於 Zustand Store 內部，不適合使用 Hook」）。

### 技術實踐
*   **Query Key**：定義清晰的 `queryKeys` 對象以管理快取。
*   **自動刷新**：在 `useMutation` 的 `onSuccess` 中，務必調用 `queryClient.invalidateQueries` 來刷新受影響的資料列表。
*   **類型安全**：必須引用 `shared/types` 中的類型定義，確保前後端一致。

---

## 2. 專案慣例
*   **頁面封裝**：新頁面應使用 `PageWrapper` 組件以統一麵包屑與佈局設定。
*   **樣式處理**：優先使用 Material UI (MUI) 的 `sx` 屬性或系統組件。
*   **異步處理**：元件內部異步邏輯優先透過 `useAsyncOperation` 或 React Query 處理。
