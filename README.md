# 資料管理與視覺化平台

> ⚠️ **此倉庫仍處於開發階段，當前版本：`v0.1.0`，尚未正式發布。**

---

## 📌 專案簡介

本專案致力於打造一個模組化、可擴展的資料管理與視覺化平台，適用於中小型資料分析團隊、教育場景或企業內部 BI 工具開發。

🔧 **最新進展（v0.1.0）**
- ✅ **支援桌面應用（Electron）**
- ✅ **資料表管理：已支援 CSV/JSON 上傳、編輯、視圖切換**
- 🛠 **儀表板管理 UI開發中**
- 🛠 **互動式圖表功能開發中**

---

## 🚀 功能特性

### 1. 資料表管理
- 支援 CSV / JSON 檔案拖曳與多檔案上傳。
- 即時預覽與資料解析（使用 PapaParse）。
- 可編輯欄位與資料，含元件停用狀態控制。
- 命名與儲存資料表，支援列表/卡片視圖切換。

### 2. 儀表板管理（進行中）
- 儀表板主頁與設定面板已建立。
- 預期整合 Recharts / Grid Layout 提供互動式圖表。

### 3. 桌面應用支援（Electron）
從 v0.1.0 起，專案正式整合 Electron，支援跨平台桌面執行。其架構劃分如下：
- `electron/main.cts`：Electron 主進程入口，初始化應用、創建主視窗。
- `electron/preload.cts`：與前端溝通的 bridge 腳本（使用 Context Bridge）。
- `electron/windows/`：視窗配置，例如主視窗尺寸、選單與事件綁定。
- `electron/ipc/`：IPC 處理模組，將前端請求轉交至主進程（資料表、儀表板等）。
- `electron/models/`：模型層，處理資料存取（如 SQLite 操作、檔案處理等）。
- `electron/services/`：邏輯服務層，封裝如資料表增刪查改功能。
- `electron/types.cts`、`constants.cts`、`utils.cts`：共用型別、常數與工具函式。

> 💡 預設資料儲存在 SQLite 本機資料庫，並透過 IPC 通訊與前端互動。

可用打包指令參見下方 ⬇️

### 4. 導航與佈局
- 響應式麵包屑（支援「更多」折疊）。
- 側邊欄支援多層結構與可折疊項目。
- 頂部列整合搜尋框與動態頁面標題。

### 5. 狀態管理
- 使用 Zustand + React Context 管理 UI 狀態。
- 控制右側面板、麵包屑、佈局設定等全域狀態。

### 6. 響應式 UI 設計
- 基於 Material-UI 元件庫設計，支援多螢幕裝置。
- 使用主題與 Grid 系統提供一致性介面。

### 7. 開發工作流與 CI/CD
- 使用 GitHub Actions：
  - ✅ Lint / 型別檢查
  - ✅ 單元測試（待補充）
  - ✅ 安全性審查（CodeQL + 依賴掃描）

---

## 📁 專案結構總覽

```bash
├── src
│   ├── assets            # 圖片與樣本資料
│   ├── components        # UI 元件與通用元件
│   ├── context           # React Contexts
│   ├── pages             # 各功能頁面
│   ├── stores            # Zustand 狀態管理
│   ├── theme             # MUI 主題設定
│   ├── types.tsx         # 型別定義
│   └── utils.tsx         # 工具函式
├── electron              # Electron 主程式與桌面應用邏輯
│   ├── ipc               # 前後端通訊 (IPC Handlers)
│   ├── models            # 檔案、資料表、圖表等資料操作邏輯
│   ├── services          # 業務邏輯層，例如 DataTableService
│   ├── windows           # 視窗配置與建立函式
│   ├── main.cts          # Electron 主進程入口
│   ├── preload.cts       # Preload 腳本，建立前端與主進程橋接
│   ├── constants.cts     # 共用常數定義
│   ├── types.cts         # 共用型別定義
│   ├── utils.cts         # 工具函式
│   └── tsconfig.json     # Electron 專用 TypeScript 設定
├── public                # 靜態檔案
├── tests                 # 測試（待實作）
└── .github               # CI/CD 設定
````

---

## 🧰 技術棧

| 領域     | 技術                        |
| -------- | --------------------------- |
| 前端框架 | React + Vite                |
| UI 庫    | Material-UI                 |
| 狀態管理 | Zustand + React Context     |
| 路由管理 | React Router (HashRouter)   |
| 資料解析 | PapaParse（CSV）、JSON 原生 |
| 型別系統 | TypeScript                  |
| 測試     | Jest（規劃中）              |
| 打包     | Electron + electron-builder |
| CI/CD    | GitHub Actions + CodeQL     |

---

## ⚙️ 開發指南

### ✅ 環境需求

* Node.js `>= 16.x`
* npm 或 yarn

### 🔧 安裝依賴

```bash
git clone https://github.com/ohayowu314/dashboard_platform.git
cd dashboard_platform
npm install
```

### ▶️ 啟動開發伺服器（含前端與桌面應用）

```bash
npm run dev
```

### 🧪 執行測試（未完整實作）

```bash
npm test
```

### 🛠 打包桌面應用

```bash
# macOS (ARM)
npm run dist:mac

# Windows (x64)
npm run dist:win

# Linux (x64)
npm run dist:linux
```

---

## 📋 開發進度與規劃

### ✅ 已完成

* 資料表上傳、即時預覽與基本編輯。
* 基礎導航架構與 UI 元件整合。
* Electron 整合，支援桌面執行。

### 🧩 進行中

* 多檔案上傳、拖曳、格式驗證、重複檢查。
* 儀表板互動式圖表功能。
* 資料表儲存整合 API / SQLite。
* 單元與端對端測試。
* UI/UX 優化與文件補充。

---

## 🤝 貢獻指南

歡迎開發者參與改進！

1. Fork 本倉庫
2. 建立新分支：`git checkout -b feature/your-feature`
3. 提交 PR 並詳述變更內容
4. 通過 CI 檢查並等待合併審核

---

## 📄 授權

本專案採用 [MIT License](LICENSE)，可自由使用、修改與再散布。

---

如有任何問題、建議或錯誤回報，歡迎開啟 [Issue](https://github.com/ohayowu314/dashboard_platform/issues) 或直接聯絡我們 🙌