請幫我修正 readme.md，後面提供舊版本的 readme.md 和最新的 changelog 以及 package.json

================readme.md==================
# 資料管理與視覺化平台

> **⚠️ 注意：此倉庫仍處於開發階段，尚未完成完整的功能或正式發布。**

---

## 專案簡介
本專案旨在建立一個模組化且可擴展的資料管理與視覺化平台，適用於中小型資料分析團隊、教育用途或內部 BI 工具開發。平台主要功能包括：
- 📊 **資料表管理**：支援匯入、編輯、顯示及操作 CSV/JSON 資料。
- 📈 **儀表板管理**：提供多層次的圖表編輯與視覺化功能。
- 🧭 **導航與佈局**：清晰的導航結構（側邊欄、頂部導航、麵包屑等）。
- ⚙️ **狀態管理**：採用 Zustand 和 React Context 提升效能。
- 🖥 **響應式 UI**：整合 Material-UI，提供現代化的使用者介面。

---

## 功能特性

### 1. 資料表管理
- 支援拖曳與多檔案上傳，並提供「純資料」與「含資訊」兩種模式。
- 動態解析 CSV/JSON 檔案並預覽內容。
- 支援表格命名、確認儲存與操作選單（瀏覽、編輯、下載、刪除）。
- 視圖模式切換：列表與卡片視圖。

### 2. 儀表板管理（初步實作中）
- 已建立儀表板主頁與右側設定面板。
- 預計支援圖表組合與互動式設定。

### 3. 導航與佈局
- 麵包屑：響應式設計，根據螢幕大小動態顯示。
- 側邊欄：嵌套、可折疊的導航結構，支援圖示顯示。
- 頂部導航：整合搜尋框與頁面標題顯示。

### 4. 狀態管理
- 採用 Zustand + React Context 實現集中式狀態管理。
- 支援右側面板開關與麵包屑更新。

### 5. UI 整合與響應式設計（初步實作中）
- 使用 Material-UI 元件（如 Table、Grid）提升視覺一致性。
- 預期支援多螢幕尺寸，提供最佳化的使用者體驗。

### 6. 開發工作流與 CI/CD
- GitHub Actions：配置 lint、型別檢查、測試與安全性審核流程。
- 依賴性審查與 CodeQL 安全性分析。

---

## 專案架構

```bash
├── src
│   ├── assets            # 靜態資源（圖片、範例資料）
│   ├── components        # UI 元件（含 layout、common、DataTablesPage 等）
│   ├── context           # React Context 與 Provider
│   ├── pages             # 各功能頁面
│   ├── stores            # Zustand 狀態管理
│   ├── theme             # MUI 主題設定
│   ├── types.tsx         # 型別定義
│   └── utils.tsx         # 工具函式（如資料解析）
├── public                # 公共資源
├── tests                 # 測試文件（尚未實作）
└── .github               # GitHub Actions 配置
```

---

## 技術棧
- 前端框架：React + Vite
- UI 庫：Material-UI
- 路由管理：React Router
- 狀態管理：Zustand + React Context
- 型別檢查：TypeScript
- 資料解析：PapaParse（CSV）、JSON 原生解析
- 測試框架：Jest + React Testing Library
- CI/CD：GitHub Actions

---

## 開發指南

### 環境需求
- Node.js 版本：`>=16.0.0`
- npm 或 yarn

### 安裝
```bash
# Clone 此倉庫
git clone https://github.com/ohayowu314/dashboard_platform.git

# 安裝依賴
npm install
```

### 啟動開發伺服器（使用 Vite）
```bash
npm run dev
```

### 執行測試
```bash
npm test
```

---

## 進度與待辦事項

### ✅ 已完成
- 資料表上傳、預覽與編輯流程。
- 基礎佈局與導航元件。

### 🛠 待辦
- 儀表板互動式圖表整合。
- 資料表匯出與 API 儲存。
- 優化 UI/UX 設計。
- 單元測試與 E2E 測試。
- 撰寫完整的使用者文件。

---

## 貢獻指南
歡迎任何形式的貢獻！請遵循以下步驟：
1. Fork 此倉庫。
2. 創建分支進行修改（`git checkout -b feature/your-feature`）。
3. 提交 PR（Pull Request）。

---

## 版權聲明
此專案採用 [MIT License](LICENSE)。請自由使用、修改與分發。

---

如有任何問題或建議，請開 Issue 或聯繫我們！🎉
====================================

================changelog.md====================
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
====================================


=================package.json===================
```json
{
  "name": "dashboard-platform",
  "private": true,
  "version": "0.1.0-pre-alpha",
  "type": "module",
  "description": "Dashboard Platform Application",
  "author": "Jack Wu <mailto:48574669+ohayowu314@users.noreply.github.com>",
  "main": "dist-electron/main.cjs",
  "homepage": "./",
  "scripts": {
    "dev": "npm-run-all --parallel dev:react dev:electron",
    "dev:react": "vite",
    "dev:electron": "npm run transpile:electron && cross-env NODE_ENV=development electron .",
    "build": "tsc -b && vite build",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "lint": "eslint .",
    "preview": "vite preview",
    "transpile:electron": "tsc --project electron/tsconfig.json",
    "dist:mac": "npm run transpile:electron && npm run build && electron-builder --mac --arm64",
    "dist:win": "npm run transpile:electron && npm run build && electron-builder --win --x64",
    "dist:linux": "npm run transpile:electron && npm run build && electron-builder --linux --x64"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^7.3.1",
    "@mui/material": "^7.3.1",
    "better-sqlite3": "^12.2.0",
    "file-saver": "^2.0.5",
    "jszip": "^3.10.1",
    "papaparse": "^5.5.3",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-grid-layout": "^1.5.2",
    "react-hook-form": "^7.62.0",
    "react-router-dom": "^7.8.0",
    "recharts": "^3.1.2",
    "uuid": "^11.1.0",
    "zod": "^4.1.3",
    "zustand": "^5.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/better-sqlite3": "^7.6.13",
    "@types/papaparse": "^5.3.16",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "cross-env": "^10.0.0",
    "electron": "^38.0.0",
    "electron-builder": "^26.0.12",
    "eslint": "^9.33.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "npm-run-all": "^4.1.5",
    "prettier": "^3.6.2",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.39.1",
    "vite": "^7.1.2"
  }
}
```
====================================

這是 electron 資料夾的結構，請適當的加進去
```
  electron/
  ├── ipc/APIModule.cts, ChartAPIHandlers.cts, DashboardAPIHandlers.cts, DataTableAPIHandlers.cts
  ├── models/ChartManager.cts, DatabaseManager.cts, DataTableManager.cts, FileManager.cts
  ├── services/DataTableService.cts
  ├── windows/mainWindow.cts
  ├── constants.cts
  ├── main.cts
  ├── preload.cts
  ├── tsconfig.json
  ├── types.cts
  └── utils.cts
```