# Changelog

> ⚠️ 注意：此倉庫仍處於開發階段，以下更新僅供參考，尚未正式發布。

---

## [0.3.0](https://github.com/ohayowu314/dashboard_platform/compare/v0.2.1...v0.3.0) (2026-04-24)
此版本為重大架構重構，核心聚焦於儀表板區塊系統的統一、引入編輯草稿機制，並全面廢止獨立圖表功能。

### ⚡ BREAKING CHANGES 重大變更
- **廢除獨立圖表實體 (Abolished Independent Charts)**  
  不再支援單獨建立、儲存或管理圖表。所有圖表現在皆作為「儀表板區塊」存在。
  - 移除 `/charts` 相關路由與側邊欄入口。
  - 移除 `ChartService` 與 `ChartManager` 後端模組。
  - 資料庫中不再建立 `charts` 資料表。
- **儀表板區塊系統重構 (Block System Refactoring)**  
  表格與圖表現在統一為 `ChartBlock`，透過 `chartType`（含 `"table"`）區分顯示類型。
- **引入編輯草稿機制 (Draft System)**  
  編輯流程現在基於 `draft.json` 檔案。
  - 進入編輯器時自動建立草稿。
  - 任何變更即時（Debounced）儲存至草稿，防止重新整理或斷電導致進度遺失。
  - 僅在點擊「儲存」或「完成」時才會將草稿合併至正式 `config.json`。

---

### ✨ Features 新功能

#### 📊 儀表板管理 Dashboard Management
- **全版三欄式區塊編輯器**  
  新增專用的區塊編輯頁面（左側資料配置、中間即時預覽、右側屬性設定），取代原本的彈窗編輯器。
  _New three-column block editor with live preview, replacing the legacy modal-based editing._
- **自動儲存草稿 (Auto-save to Draft)**  
  實現了防抖（Debounce）自動儲存功能，確保編輯過程中的每一項調整皆持久化在硬碟上。
  _Implemented debounced auto-saving to `draft.json` for both dashboard and block edits._
- **增強型區塊包裝器**  
  優化了區塊的佈局調整與內容渲染邏輯，支援表格與多種圖表類型的無縫切換。
  _Enhanced block wrapper for seamless switching between tables and various chart types._

#### ⚙️ 後端與系統 Backend & System
- **草稿 API 暴露**  
  新增 `getDashboardDraft`, `saveDashboardDraft`, `deleteDashboardDraft` 等 IPC 介面。
  _Exposed new IPC interfaces for draft management._
- **FileManager 工具集擴充**  
  新增目錄遞迴刪除 `deleteDirectory` 與路徑處理工具，優化儀表板刪除時的清理邏輯。
  _Extended `FileManager` with recursive directory deletion and path utility methods._

---

## [0.2.1](https://github.com/ohayowu314/dashboard_platform/compare/v0.2.0...v0.2.1) (2025-10-03)
此版本重構上傳流程，加入多檔案與衝突解決，改善使用者體驗與穩定性。

### ⚡ BREAKING CHANGES 重大變更
- **多檔案上傳與衝突解決** (Issue [#39](https://github.com/ohayowu314/dashboard_platform/issues/39), [d9fffde](https://github.com/ohayowu314/dashboard_platform/commit/d9fffde0a4039ef32d98422a3c77bde330b97aa5), [0f672ac](https://github.com/ohayowu314/dashboard_platform/commit/0f672ac7d9859b8e7a073f7cffff63af2e7c0da2), [e214c33](https://github.com/ohayowu314/dashboard_platform/commit/e214c331063d3cdb4f65bd680a875ae2a1be66a8))  
  資料表上傳支援多檔案並行，前端即時檢查與標示檔名（表名）衝突，使用者可針對每個衝突檔案選擇「自動更名」、「覆蓋」、「略過」等行為，並將決策同步傳遞給後端，後端透過 `uploadMode` 參數，執行 `getNewTableName` 或覆蓋操作。  
  _Multi-file upload now supports real-time conflict detection and resolution. Users can choose "rename", "replace", or "skip" for each conflicting file, and the backend will process according to the selected mode._

---

### ✨ Features 新功能

#### 📤 資料表上傳 Data Table Upload
- **多檔案上傳流程重構** (Issue [#39](https://github.com/ohayowu314/dashboard_platform/issues/39), [e214c33](https://github.com/ohayowu314/dashboard_platform/commit/e214c331063d3cdb4f65bd680a875ae2a1be66a8), [8c4ab0c](https://github.com/ohayowu314/dashboard_platform/commit/8c4ab0c6db07e95259e569a3a46726c443651ac4))  
  上傳對話框支援多檔案拖拉、選取，並即時顯示每個檔案的衝突狀態與解決選項（rename/replace/skip），可動態移除單一檔案。  
  _Upload dialog supports multi-file drag & drop, real-time conflict status, and per-file conflict resolution options (rename/replace/skip). Files can be removed individually._
- **即時衝突檢查** (Issue [#39](https://github.com/ohayowu314/dashboard_platform/issues/39), [e214c33](https://github.com/ohayowu314/dashboard_platform/commit/e214c331063d3cdb4f65bd680a875ae2a1be66a8), [0f672ac](https://github.com/ohayowu314/dashboard_platform/commit/0f672ac7d9859b8e7a073f7cffff63af2e7c0da2))  
  前端選檔後自動 debounce 向後端查詢所有檔案（表名）是否衝突，並於 UI 標示。間隔時間設定為 300ms，避免頻繁 API 請求。  
  _After file selection, frontend debounces and queries backend for all table name conflicts, displaying results in the UI. Real-time conflict detection with a 300ms debounce mechanism to reduce redundant API calls._
- **上傳狀態面板** (Issue [#40](https://github.com/ohayowu314/dashboard_platform/issues/40), [f27ac50](https://github.com/ohayowu314/dashboard_platform/commit/f27ac50dc5cdb353524b639c4c710c9ad68b073d), [71fdb0a](https://github.com/ohayowu314/dashboard_platform/commit/71fdb0a09687da212800c6f7dc4b271c3e37aea7), [4b7e019](https://github.com/ohayowu314/dashboard_platform/commit/4b7e019ddd1b1a2b814a20ba4b20b1902f74c10a), [8c4ab0c](https://github.com/ohayowu314/dashboard_platform/commit/8c4ab0c6db07e95259e569a3a46726c443651ac4), [0a88c30](https://github.com/ohayowu314/dashboard_platform/commit/0a88c30c5516d513d4403352834eda8b1e53b4b1))  
  右側面板新增 `UploadStatusPanel`，支援展開/收合、顯示上傳進度、成功/失敗狀態、錯誤訊息、手動移除、成功10秒/失敗30秒自動消失。  
  _New `UploadStatusPanel` in the right panel: supports expand/collapse, shows upload progress, success/failure, error messages, manual removal, and auto-removal (10s for success, 30s for failure)._
- **useDebounce hook** ([e214c33](https://github.com/ohayowu314/dashboard_platform/commit/e214c331063d3cdb4f65bd680a875ae2a1be66a8))  
  自訂 React hook，優化高頻率檔案選取時的衝突查詢效能。  
  _Custom React hook for debouncing high-frequency file selection events, optimizing conflict check performance._
- **Zustand 狀態管理** ([f27ac50](https://github.com/ohayowu314/dashboard_platform/commit/f27ac50dc5cdb353524b639c4c710c9ad68b073d), [71fdb0a](https://github.com/ohayowu314/dashboard_platform/commit/71fdb0a09687da212800c6f7dc4b271c3e37aea7), [888c61d](https://github.com/ohayowu314/dashboard_platform/commit/888c61d13771292877be9dff21dc4e603d7d1587), [1c277ff](https://github.com/ohayowu314/dashboard_platform/commit/1c277ff387fd0501158ec2914a8d73bd68b23f4c))  
  上傳流程與狀態統一由 `uploadStore` 管理，解耦元件間狀態傳遞。  
  _Upload process and state are managed by a centralized Zustand store, decoupling component state._

#### 🧩 JSON 格式驗證與錯誤提示 JSON Format Validation & Error Display
- **嚴格 JSON 格式驗證** (Issue [#38](https://github.com/ohayowu314/dashboard_platform/issues/38), [f27ac50](https://github.com/ohayowu314/dashboard_platform/commit/f27ac50dc5cdb353524b639c4c710c9ad68b073d))  
  上傳 JSON 檔案時，檢查是否為非空陣列、每個元素皆為物件且鍵值一致，否則拋出 ValidationError。  
  _Strict JSON validation: uploaded JSON must be a non-empty array of objects with consistent keys, otherwise a ValidationError is thrown._
- **標準格式範例與複製** (Issue [#38](https://github.com/ohayowu314/dashboard_platform/issues/38), [f27ac50](https://github.com/ohayowu314/dashboard_platform/commit/f27ac50dc5cdb353524b639c4c710c9ad68b073d))  
  錯誤訊息提供「檢視標準 JSON 格式」對話框，內含可複製的標準範例。  
  _Error messages provide a dialog with a standard JSON format example and one-click copy._
- **錯誤訊息優化** (Issue [#38](https://github.com/ohayowu314/dashboard_platform/issues/38), [de35f00](https://github.com/ohayowu314/dashboard_platform/commit/de35f006b37285cf1003d5f387f07844fac12b77), [f27ac50](https://github.com/ohayowu314/dashboard_platform/commit/f27ac50dc5cdb353524b639c4c710c9ad68b073d))  
  前後端錯誤訊息一致，ValidationError 會於 UI 明確標示。  
  _Frontend and backend error messages are unified; ValidationError is clearly indicated in the UI._

#### 🛡️ 檔案驗證 File Validation
- **檔案類型/大小/空檔驗證** (Issue [#37](https://github.com/ohayowu314/dashboard_platform/issues/37), [77c8d85](https://github.com/ohayowu314/dashboard_platform/commit/77c8d8550bcea49ae21847e4ea2b2eff9f1bf1c6))  
  parseDataFile 支援檢查檔案類型（CSV/JSON）、大小（10MB）、空檔等，並給予明確錯誤提示。  
  _parseDataFile now validates file type (CSV/JSON), size (10MB), and empty files, with clear error messages._

#### 🗃️ 資料表管理 Data Table Management
- **防止重複表名建立** ([0f672ac](https://github.com/ohayowu314/dashboard_platform/commit/0f672ac7d9859b8e7a073f7cffff63af2e7c0da2), [572b5b9](https://github.com/ohayowu314/dashboard_platform/commit/572b5b9337bb6a83e5ed0e5ce4f40be7cf796128))  
  後端於建立資料表時，若名稱重複，支援以下衝突解決方式: 自動更名(透過 `getNewTableName` 自動生成新名稱並建立資料表)、覆蓋模式(使用 `uploadMode: "replace"` 覆蓋既有資料表內容)。前端可透過設定 `uploadMode` 來指定所需的衝突解決方式。  
  _When creating a database table, the backend supports the following conflict resolution mechanisms in case of duplicate names: Automatic Renaming(A new name is automatically generated using `getNewTableName`, and the table is created with the new name), Overwrite Mode (Existing table contents are overwritten by specifying `uploadMode: "replace"`). The frontend can specify the desired conflict resolution method by setting the `uploadMode` parameter._
- **getNameFromFile 工具** ([e214c33](https://github.com/ohayowu314/dashboard_platform/commit/e214c331063d3cdb4f65bd680a875ae2a1be66a8))  
  前端統一以去除副檔名的檔名作為資料表名稱，確保前後端一致。  
  _Frontend uses filename without extension as the table name, ensuring consistency with backend._

#### 🛠️ 其他 Others
- **依賴升級** ([8b25ded](https://github.com/ohayowu314/dashboard_platform/commit/8b25dedd9e6853aaea4dfe324bbf2f228364eae9))  
  使用 `npm audit fix` 檢查並修正 High 威脅依賴問題: tar-fs 套件升級至 2.1.4。  
  _Upgraded tar-fs dependency via npm audit fix to resolve High threat vulnerabilities._
- **型別與 API 統一** ([d9fffde](https://github.com/ohayowu314/dashboard_platform/commit/d9fffde0a4039ef32d98422a3c77bde330b97aa5))  
  型別定義與 IPC API 介面同步調整，支援多檔案衝突查詢與上傳模式參數。  
  _Type definitions and IPC API interfaces updated to support multi-file conflict checking and upload mode parameters._

---

## [0.2.0](https://github.com/ohayowu314/dashboard_platform/compare/v0.1.0...v0.2.0) (2025-09-19)


### ⚠ BREAKING CHANGES 重大變更

* **types:** Some type imports must now reference `shared/types` instead of local `types` files 部分類型導入現在必須引用 `shared/types` 文件，而不是本地 `types` 文件 ([942efe3](https://github.com/ohayowu314/dashboard_platform/commit/942efe30a6cc85152bef31fe4f78616fa33ec484)), closes [#30](https://github.com/ohayowu314/dashboard_platform/issues/30)

  * **types:** move shared types to dedicated directory and update imports 將共用類型移至專用目錄並更新匯入 ([0b3b180](https://github.com/ohayowu314/dashboard_platform/commit/0b3b180235398086858581c04db8f72e767f8908))


### Features 新功能

#### 📊 Data Tables

* add navigation for creating new data table 新增 **建立新資料表** 功能 ([644544c](https://github.com/ohayowu314/dashboard_platform/commit/644544c0fce0082b0d97a79d45ec025597c5028e))
* support table names clickable to navigate to edit view 新增 **點擊表格名稱導向編輯檢視** 功能 ([7754eaf](https://github.com/ohayowu314/dashboard_platform/commit/7754eaf51a862c6b7eaa7cfa1a91dc26232ea316))
* add **delete confirmation dialog** for data tables 新增資料表 **刪除確認對話方塊** ([b1de479](https://github.com/ohayowu314/dashboard_platform/commit/b1de47928bcf7aaf00f54104479a78f665efd660))
* Unified editing pages and support backend table loading/updating 統一編輯頁面並支援 **後端表單載入/更新** ([#32](https://github.com/ohayowu314/dashboard_platform/issues/32), [c2d444a](https://github.com/ohayowu314/dashboard_platform/commit/c2d444afa6678f3401e97314c6ce1ca671b4a625))
  * add support for updating data tables and unify data schema 支援 **資料表更新與統一資料模式** ([99060d2](https://github.com/ohayowu314/dashboard_platform/commit/99060d21237a20cdb9b4bf920eb4029ce85f46c5))
  * support editing and updating data tables via new API 新增透過 **新 API 編輯與更新資料表** ([94932e3](https://github.com/ohayowu314/dashboard_platform/commit/94932e3eefc1913ff9d8a335fc94e1f5dd0f2e3a))

#### 🪝 Hooks

* add `useTableDataInitializer` (for initializing data) 新增 `useTableDataInitializer`：初始化資料
* add `useTableGetter` (responsible for obtaining data table content and information from the backend) 新增 `useTableGetter`：取得後端資料表內容與資訊
  ([b3cba61](https://github.com/ohayowu314/dashboard_platform/commit/b3cba615d3d5365bfef9130b6845066b0649aff7))

#### 🖼️ UI & Layout

* **RightPanel**： Supports right panel title and collapsibility, and updates documentation. 支援標題、可折疊功能，並更新文件 ([#33](https://github.com/ohayowu314/dashboard_platform/issues/33), [a554f1b](https://github.com/ohayowu314/dashboard_platform/commit/a554f1bfec523f0dbabe9a34663801ad20cb2008), [f207263](https://github.com/ohayowu314/dashboard_platform/commit/f207263378f1f140ce0de8064fc2eb82fcdcb7a8))
* **RightPanel**： improve RightPanel layout and add default text 改進佈局並新增預設文字 ([#34](https://github.com/ohayowu314/dashboard_platform/issues/34), [a8215b5](https://github.com/ohayowu314/dashboard_platform/commit/a8215b52709bcffcb98863aedf31da409b012397))

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

---

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
