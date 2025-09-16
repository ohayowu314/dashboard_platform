# Changelog

> ⚠️ 注意：此倉庫仍處於開發階段，以下更新僅供參考，尚未正式發布。

---

## [0.1.0](https://github.com/ohayowu314/dashboard_platform/compare/v0.1.0-pre-alpha...v0.1.0) (2025-09-15)


### Features

* Add disabled state to `EditableCell` component 為 `EditableCell` 元件新增停用狀態 ([f47b9fb](https://github.com/ohayowu314/dashboard_platform/commit/f47b9fbc0eafbcacdce86f82d8b4adb89e1458d4))
* **electron:** Add Electron support for desktop application 為桌面應用程式新增 Electron 支援 ([b46db10](https://github.com/ohayowu314/dashboard_platform/commit/b46db10e890b794a47ea92090dbc4d6edf7ced41))
* **electron:** Enhance Electron setup with improved TypeScript configuration and routing adjustments 透過改進 TypeScript 配置和路由調整，增強 Electron 設定 ([8029d0a](https://github.com/ohayowu314/dashboard_platform/commit/8029d0aadb12cb170cdd6cc332090d3c9b2d627d))
* **electron:** Update Electron main process with enhanced window configuration and cleanup; remove unused data files 更新 Electron 主進程，增強視窗配置和清理功能；刪除未使用的資料檔案 ([caf02b0](https://github.com/ohayowu314/dashboard_platform/commit/caf02b0d43c8ced7523bcbbda69fa5e27113cfbe))
* Refactor `DataTableEditorPage` with new reusable components and hooks 重構 `DataTableEditorPage`，新增新的可重複使用元件和鉤子 ([cc5633f](https://github.com/ohayowu314/dashboard_platform/commit/cc5633f60544be214c7799e2109dfcc4dec3a3fc))


### Bug Fixes

* Replace BrowserRouter with HashRouter for improved routing compatibility 將 BrowserRouter 替換為 HashRouter，以提高路由相容性 ([544cbb4](https://github.com/ohayowu314/dashboard_platform/commit/544cbb460e016ca4d494d06078e6a1cf5e97b624))


## v0.1.0 pre-alpha（開發階段）
版本狀態：Pre-alpha（功能尚未穩定，僅供開發測試）

### 新增功能

#### 資料表管理
- 新增資料表編輯器頁面，支援 CSV 和 JSON 檔案上傳。
- 提供檔案解析與動態預覽功能。
- 資料表名稱支援即時編輯與狀態同步。
- 引入 `ParsedData` 型別集中管理資料結構。
- 支援列表與卡片視圖切換，使用 MUI 的 `ToggleButtonGroup` 控制。
- 新增通用型資料表元件，支援動態生成表頭與內容。

#### 儀表板管理
- 初步建立儀表板頁面與右側設定面板。

#### 導航與佈局
- 麵包屑支援響應式設計：小螢幕顯示最後一項，大螢幕顯示最後兩項，其餘折疊為「更多」選單。
- 支援以 `{ label, path }` 結構動態生成麵包屑。
- 側邊欄支援嵌套與可折疊的導航結構，並顯示圖示。
- 頂部導航整合搜尋框與頁面標題，使用自定義主題統一樣式。

#### 狀態管理
- 採用 Zustand 與 React Context 組合，集中管理 UI 狀態。
- 移除過時的 `useUIStore` 和 `RightPanelProvider`，簡化狀態邏輯。

#### 檔案上傳與處理
- 支援拖曳與多檔案上傳，含檔案類型驗證與重複檢查。
- 檔案列表支援移除功能，並使用 MUI 元件重構顯示。

---

### 改進與重構

#### 資料表管理
- 重構檔案解析邏輯，將 `parseFile` 改名為 `parseDataFile`。
- 將 `ParsedData` 型別移至 `src/types.tsx` 集中管理。
- 提供 `renderCards` 和 `renderList` 函式以區分不同視圖模式。

#### 導航與佈局
- 麵包屑新增響應式行為，根據螢幕大小動態調整顯示內容。
- 側邊欄改進導航項目結構，支援更清晰的層次化設計。

#### 狀態管理
- 移除舊 Context，改用 Zustand 集中管理 UI 狀態。
- 簡化狀態邏輯，提升程式碼可維護性。

#### 檔案上傳
- 新增檔案類型驗證邏輯，根據上傳模式（CSV/JSON）篩選檔案。
- 防止重複檔案上傳，提升使用者工作流流暢性。

---

### 開發工作流
- 配置 GitHub Actions CI/CD：包含 lint、型別檢查、測試與安全性審核。
- 引入 `dependency-review.yml` 進行依賴性檢查。
- 使用 `codeql.yml` 配置安全性分析。

---

### 待辦事項
- 實作儀表板的建立、編輯與顯示。
- 資料表匯出功能與 API 儲存整合。
- 優化 UI/UX 設計。
- 單元測試與 E2E 測試。
- 完善的使用者文件與錯誤處理。

---

### 版本歷史
- **v0.1.0 pre-alpha**：初步完成資料表管理、導航佈局、檔案上傳功能，以及基礎的狀態管理與 UI 整合。
