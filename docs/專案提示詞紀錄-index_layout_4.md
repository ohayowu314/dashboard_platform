## Copilot 提問 注入首頁的內容
> 另開新一頁

【專案背景】
- 技術：Vite + React + MUI + Zustand + TypeScript
- 類型：資料視覺化儀表板
- 架構：
  src/
  ├── components/layout/Sidebar.tsx, TopNav.tsx, RightPanel.tsx, Layout.tsx, PageWrapper.tsx
  ├── context/LayoutContext.tsx, LayoutProvider.tsx, useLayoutContext.tsx
  ├── pages/UploadPage.tsx, ChartConfigPage.tsx, DashboardPage.tsx, DownloadPage.tsx
  ├── routes/tocMap.ts
  ├── stores/layoutStore.ts
  ├── types.ts
  ├── utils.ts
  └── App.tsx

【Layout 狀態】
- 使用 Zustand 管理 tocItems, breadcrumb, rightPanelContent, rightPanelEnabled
- 使用 LayoutProvider + useLayoutContext hook 注入內容

【目前問題或需求】
雖然 UploadPage 已經能很好的注入內容了，但是 首頁 "/" 的內容怎麼辦，要如何注入


【當前相關檔案】
```tsx
// src/pages/UploadPage.tsx
import { PageWrapper } from "../components/layout/PageWrapper";
import { tocMap } from "../routes/tocMap";
import type { TocItem } from "../types";

const tocItems: TocItem[] = tocMap["/upload"] || [];

export const UploadPage: React.FC = () => {
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumb={["上傳資料"]}
      content={<div>這是上傳資料頁面222</div>}
      rightPanel={<div>右側說明：如何上傳資料</div>}
    />
  );
};
```

```tsx
// src/components/layout/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { useLayoutContext } from "../../context/useLayoutContext";
import "./layout.css";

export const Layout: React.FC = () => {
  const { rightPanelEnabled } = useLayoutContext();

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-area">
        <TopNav />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      {rightPanelEnabled && <RightPanel />}
    </div>
  );
};
```

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { UploadPage } from "./pages/UploadPage";
import { ChartConfigPage } from "./pages/ChartConfigPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DownloadPage } from "./pages/DownloadPage";
import { LayoutProvider } from "./context/LayoutProvider";

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="upload" element={<UploadPage />} />
            <Route path="chart-config" element={<ChartConfigPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="download" element={<DownloadPage />} />
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;
```

## Copilot 回答 注入首頁的內容
你目前的架構設計非常清晰，`UploadPage` 能成功注入 `PageWrapper` 的內容，是因為你在該頁面中直接使用了 `PageWrapper` 並傳入了 `tocItems`、`breadcrumb`、`content` 和 `rightPanel` 等 props。

而首頁 `/` 的內容目前尚未定義，因此你可以比照 `UploadPage` 的方式，建立一個 `HomePage.tsx`，並在其中使用 `PageWrapper` 注入首頁的內容。以下是具體做法：

---

### ✅ 步驟一：新增 `HomePage.tsx`

```tsx
// src/pages/HomePage.tsx
import { PageWrapper } from "../components/layout/PageWrapper";
import { tocMap } from "../routes/tocMap";
import type { TocItem } from "../types";

const tocItems: TocItem[] = tocMap["/"] || [];

export const HomePage: React.FC = () => {
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumb={["首頁"]}
      content={<div>歡迎使用資料視覺化儀表板</div>}
      rightPanel={<div>右側說明：這是首頁的導覽與簡介</div>}
    />
  );
};
```

---

### ✅ 步驟二：在 `App.tsx` 中加入首頁路由

```tsx
import { HomePage } from "./pages/HomePage"; // ← 新增這行

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} /> {/* ← 新增這行 */}
            <Route path="upload" element={<UploadPage />} />
            <Route path="chart-config" element={<ChartConfigPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="download" element={<DownloadPage />} />
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}
```

這裡的 `index` 屬性代表 `/` 路徑，也就是首頁。

---

### ✅ 可選：補上 `tocMap["/"]` 的內容

如果你有使用 `tocMap` 來管理側邊選單或導覽結構，記得在 `tocMap.ts` 中補上首頁的項目：

```ts
// src/routes/tocMap.ts
import type { TocItem } from "../types";

export const tocMap: Record<string, TocItem[]> = {
  "/": [
    { label: "首頁", path: "/" },
  ],
  "/upload": [
    { label: "上傳資料", path: "/upload" },
  ],
  // 其他頁面...
};
```

---

這樣就能讓首頁也像其他頁面一樣，透過 `PageWrapper` 注入內容並顯示右側說明、麵包屑與 tocItems。

需要我幫你補上 `HomePage.tsx` 的完整程式碼或是 `PageWrapper` 的實作細節嗎？

## Copilot 提問 
## Copilot 回答 
## Copilot 提問 
## Copilot 回答 
## Copilot 提問 
## Copilot 回答 
## Copilot 提問 
## Copilot 回答 
## Copilot 提問 
## Copilot 回答 