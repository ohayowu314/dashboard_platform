# 資料管理與視覺化平台

> ⚠️ **此倉庫仍處於開發階段，當前版本：`v0.3.0`，尚未正式發布。**

---

## 📌 專案簡介

本專案致力於打造一個模組化、可擴展的資料管理與視覺化平台，適用於中小型資料分析團隊、教育場景或企業內部 BI 工具開發。

🔧 **最新進展（v0.3.0）**
- ⚠ **重大變更**：**廢除獨立圖表實體**
  - 所有圖表現在皆整合為「儀表板區塊」。不再支援獨立圖表的建立與管理，原圖表功能已併入儀表板編輯流程。
- ⚠ **重大變更**：**引入編輯草稿系統（Draft System）**
  - 使用者在編輯儀表板或區塊時，系統會自動建立 `draft.json`。所有變更即時防抖儲存，確保進度不因斷電或重新整理而遺失。只有點擊「完成」才會正式套用。
- ✅ **全新三欄式區塊編輯器**
  - 提供大型全版編輯器：左側配置資料源與欄位、中間即時預覽、右側設定樣式與類型（含表格切換）。
- ✅ **系統重構與清理**
  - 統一了 `ChartBlock` 渲染邏輯，移除廢棄的 `ChartService` 與相關後端模組。

---

## 🚀 功能特性

### 1. 儀表板與區塊管理 (v0.3.0 核心)
- **統一區塊系統**：表格與圖表整合為單一區塊實體，支援一鍵切換。
- **編輯草稿機制**：基於檔案的進度追蹤，支援「取消編輯」還原與「自動儲存」。
- **互動式畫布**：支援區塊拖拉、縮放，佈局狀態即時同步至草稿。
- **全版預覽編輯器**：支援多種圖表類型（柱狀圖、折線圖、圓餅圖、散點圖、直方圖、區域圖）與資料表檢視。

### 2. 資料表管理
- 支援 CSV / JSON 檔案拖曳與多檔案上傳。
- 多檔案上傳衝突解決：提供自動更名 `getNewTableName` 與覆蓋機制。
- 即時預覽與資料解析，支援可編輯欄位與資料。
- 命名與儲存資料表，支援列表/卡片視圖切換。

### 3. 桌面應用支援（Electron）
專案整合 Electron，支援跨平台桌面執行。
- `electron/ipc/`：新增 `get-dashboard-draft`、`save-dashboard-draft` 等端點。
- `electron/models/`：`FileManager` 支援目錄遞迴刪除與路徑工具。
- 預設資料儲存在 SQLite 本機資料庫，配置檔儲存在使用者資料目錄。

---

## 📁 專案結構總覽

```bash
├── src
│   ├── components
│   │   └── DashboardsPage    # 儀表板畫布、區塊、編輯器
│   ├── pages
│   │   ├── DashboardEditorPage.tsx  # 儀表板主編輯器（含草稿邏輯）
│   │   └── ChartEditorPage.tsx      # 區塊專用編輯器
│   ├── stores                # Zustand 狀態管理
│   └── theme                 # MUI 主題設定
├── electron
│   ├── ipc                   # 註冊 Dashboard/DataTable API
│   ├── services              # 業務邏輯（含草稿處理）
│   └── models                # 檔案管理與資料庫操作
├── shared                    # 前後端共用型別 (shared/types)
└── docs/plans                # 重構與功能實現計劃書
```

---

## 🧰 技術棧

| 領域     | 技術                        |
| -------- | --------------------------- |
| 前端框架 | React + Vite                |
| UI 庫    | Material-UI                 |
| 繪圖庫   | Recharts                    |
| 狀態管理 | Zustand + React Context     |
| 資料解析 | PapaParse（CSV）            |
| 打包     | Electron + electron-builder |
| 資料庫   | SQLite (better-sqlite3)     |

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

* 資料表多檔案上傳、衝突解決與即時預覽 (v0.2.1)。
* **廢除獨立圖表，統一儀表板區塊系統 (v0.3.0)。**
* **實現編輯草稿系統，支援防抖自動儲存 (v0.3.0)。**
* **重構全版三欄式區塊編輯器 (v0.3.0)。**
* 基礎導航、響應式佈局與 UI 元件整合。

### 🧩 進行中

* 區塊色彩與樣式自定義。
* 資料表架構（Schema）編輯：增減/改名欄位。
* 儀表板匯入與匯出功能。
* 明暗模式切換與 UI/UX 拋光。

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

## 📝 版本變更摘要（v0.3.0）
- feat(dashboard): 實現基於 `draft.json` 的草稿系統與防抖自動儲存
- refactor(chart): 廢除獨立圖表實體，全面轉向儀表板區塊架構
- feat(ui): 全新三欄式全版區塊編輯器，支援即時預覽
- chore(backend): 移除廢棄的 `ChartService` 與 `ChartManager`，清理 IPC 註冊
- fix(react): 修正 `ChartBlock` 中 Hook 的調用順序問題
- feat(system): 擴充 `FileManager` 支援路徑組合與目錄刪除

完整更新記錄請參見 [完整更新紀錄](./CHANGELOG.md#030-2026-04-24)

---

如有任何問題、建議或錯誤回報，歡迎開啟 [Issue](https://github.com/ohayowu314/dashboard_platform/issues) 或直接聯絡我們 🙌
