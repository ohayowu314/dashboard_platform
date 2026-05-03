# 資料管理與視覺化平台

> ⚠️ **此倉庫仍處於開發階段，當前版本：`v0.4.0-alpha`，尚未正式發布。**

---

## 📌 專案簡介

本專案致力於打造一個模組化、可擴展的資料管理與視覺化平台，適用於中小型資料分析團隊、教育場景或企業內部 BI 工具開發。

🔧 **最新進展（v0.4.0-alpha）**
- ✅ **首頁動態導航**：實現引導模式與效率模式自動切換，並支持預設儀表板持久化。
- ✅ **架構大掃除**：徹底移除舊版圖表系統殘留代碼、過時的 `useFileParser` Hook 與相關型別。
- ⚠ **體驗優化決策**：評估並放棄骨架屏 (Skeleton) 方案，優先維持畫面的穩定性與載入效率。

---

## 🚀 功能特性

### 1. 首頁與動態導航 (v0.4.0-alpha 核心)
- **智能導入邏輯**：系統根據是否已有儀表板，自動引導至歡迎頁面或預設瀏覽模式。
- **預設內容持久化**：支援設定 `defaultDashboardId`，首頁將優先載入指定的儀表板。
- **系統配置管理**：引入 `SystemConfigManager` 統一管理全域持久化設定。

### 2. 儀表板與區塊管理 (v0.3.0 核心)
- **統一區塊系統**：表格與圖表整合為單一區塊實體，支援一鍵切換。
- **編輯草稿機制**：基於檔案的進度追蹤，支援「取消編輯」還原與「自動儲存」。
- **互動式畫布**：支援區塊拖拉、縮放，佈局狀態即時同步至草稿。
- **全版預覽編輯器**：支援多種圖表類型（柱狀圖、折線圖、圓餅圖、散點圖、直方圖、區域圖）與資料表檢視。

### 3. 資料表管理
- 支援 CSV / JSON 檔案拖曳與多檔案上傳。
- 多檔案上傳衝突解決：提供自動更名 `getNewTableName` 與覆蓋機制。
- 即時預覽與資料解析，支援可編輯欄位與資料。
- 命名與儲存資料表，支援列表/卡片視圖切換。

---

## 📁 專案結構總覽

```bash
├── src
│   ├── components
│   │   └── DashboardsPage    # 儀表板畫布、區塊、編輯器
│   ├── pages
│   │   ├── HomePage.tsx             # 動態導航首頁
│   │   ├── DashboardEditorPage.tsx  # 儀表板主編輯器（含草稿邏輯）
│   │   └── ChartEditorPage.tsx      # 區塊專用編輯器
│   ├── stores                # Zustand 狀態管理
│   └── theme                 # MUI 主題設定
├── electron
│   ├── ipc                   # 註冊 Dashboard/DataTable/System API
│   ├── services              # 業務邏輯（含配置管理、草稿處理）
│   └── models                # 檔案管理、資料庫與系統配置管理
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

* **首頁動態導航與體驗標準化 (v0.4.0-alpha)。**
* **大規模架構清理：移除舊版圖表系統與過時代碼 (v0.4.0-alpha)。**
* 資料表多檔案上傳、衝突解決與即時預覽 (v0.2.1)。
* 廢除獨立圖表，統一儀表板區塊系統 (v0.3.0)。
* 實現編輯草稿系統，支援防抖自動儲存 (v0.3.0)。
* 重構全版三欄式區塊編輯器 (v0.3.0)。
* 基礎導航、響應式佈局與 UI 元件整合。

### 🧩 進行中

* 儀表板匯入與匯出功能。
* 區塊色彩與樣式自定義。
* 資料表架構（Schema）編輯：增減/改名欄位。
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

## 📝 版本變更摘要（v0.4.0-alpha）
- feat(home): 實現首頁動態導入邏輯，支持引導模式與效率模式自動切換
- feat(system): 建立 `SystemConfigManager` 以持久化 `defaultDashboardId`
- chore(cleanup): 徹底移除歷史殘留的圖表相關模組、Hooks 與型別定義 (Issue #65)
- docs(plan): 評估並決議放棄骨架屏 (Skeleton) 方案，維持現有載入穩定性 (Issue #64)

完整更新記錄請參見 [完整更新紀錄](./CHANGELOG.md#040-alpha-2026-05-03)

---

如有任何問題、建議或錯誤回報，歡迎開啟 [Issue](https://github.com/ohayowu314/dashboard_platform/issues) 或直接聯絡我們 🙌
