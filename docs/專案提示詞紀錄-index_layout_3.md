## Copilot 提問 元件抽取
> 另開新一頁

在寫 component 元件時，如果沒有任何重複使用的可能性，我可以取出其中的元件，單獨作為一個檔案

## Copilot 回答 元件抽取
可以的！即使某個元件目前沒有重複使用的可能性，**將它抽出成獨立檔案**仍然是個不錯的做法，原因如下：

### ✅ 優點
1. **可讀性提升**：主 component 檔案會更乾淨、更容易理解。
2. **維護性更好**：未來若該元件需要修改，只需在單一檔案中處理。
3. **潛在重用性**：雖然現在不重複使用，但未來可能會用到。
4. **測試更方便**：獨立元件可以單獨撰寫測試。

### 🧠 建議做法
- 若元件邏輯簡單（例如只是一個 `<Button>` 或 `<Label>`），可以暫時寫在主 component 裡。
- 若元件包含 **狀態管理、事件處理、樣式** 或 **複雜 JSX 結構**，建議抽出成獨立檔案。

### 📁 範例結構
```bash
src/
├── components/
│   └── MyCustomCard.tsx
└── pages/
    └── HomePage.tsx
```

你目前是遇到哪一類型的元件呢？我可以幫你判斷是否適合抽出，或提供範例喔！

## Copilot 提問 元件抽取 Sidebar
```tsx
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Logo 區塊 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          <img
            src={logoImage}
            alt="A description of my image"
            style={{ width: "30px" }}
          />{" "}
          MyDashboard
        </Typography>
      </Box>

      {/* TOC 區塊 */}
      <List>
        {tocItems.map((item, index) => (
          <ListItemButton key={index} sx={{ color: "#fff" }}>
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
```

## Copilot 回答 元件抽取 Sidebar
你這段程式碼看起來像是側邊選單（Sidebar）元件，包含 Logo 區塊與 TOC（Table of Contents）清單。雖然目前可能只用在一個頁面，但這類元件通常具有**潛在重複使用性**，建議你可以抽出成獨立元件檔案，例如：

### ✅ 抽出元件的建議
建立一個 `Sidebar.tsx` 檔案，並將這段程式碼包裝成一個 React component：

```tsx
// src/components/Sidebar.tsx
import React from "react";
import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";
import logoImage from "../assets/logo.png"; // 根據你的路徑調整

interface SidebarProps {
  tocItems: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ tocItems }) => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Logo 區塊 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          <img
            src={logoImage}
            alt="A description of my image"
            style={{ width: "30px" }}
          />{" "}
          MyDashboard
        </Typography>
      </Box>

      {/* TOC 區塊 */}
      <List>
        {tocItems.map((item, index) => (
          <ListItemButton key={index} sx={{ color: "#fff" }}>
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
```

### ✅ 使用方式
在你的頁面中引入並使用：

```tsx
import Sidebar from "../components/Sidebar";

const tocItems = ["首頁", "報表", "設定"];

function HomePage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar tocItems={tocItems} />
      {/* 其他內容 */}
    </div>
  );
}
```

---

如果你未來想讓 Sidebar 更動態（例如點選項目後導頁），抽出來會更容易擴充。需要我幫你加上路由功能或是抽成更模組化的設計嗎？

### 推薦三問
- Sidebar 加上路由導頁怎麼做
- Sidebar 如何支援動態選單資料
- Sidebar 樣式要怎麼客製化

## Copilot 提問 單獨抽出logo Sidebar加上路由導頁
【專案背景】
- 技術：Vite + React + MUI + Zustand + TypeScript
- 類型：資料視覺化儀表板
- 架構：
  src/
  ├── components/layout/Sidebar.tsx, TopNav.tsx, RightPanel.tsx, Layout.tsx
  ├── context/RightPanelContext.tsx, RightPanelProvider.tsx, useRightPanel.tsx
  ├── pages/UploadPage.tsx, ChartConfigPage.tsx, DashboardPage.tsx, DownloadPage.tsx
  ├── stores/uiStore.ts
  ├── types.ts
  ├── utils.ts
  └── App.tsx

【RightPanel 狀態】
- 使用 Zustand 管理 rightPanelEnabled
- 使用 RightPanelProvider + useRightPanel hook 注入內容

【目前問題或需求】
- 想將 logo 部分單獨抽出
- Sidebar 加上路由導頁怎麼做

## Copilot 回答 單獨抽出logo Sidebar加上路由導頁
感謝你提供完整的專案背景！以下是針對你兩個需求的具體做法：

---

### ✅ 1. 抽出 Logo 元件

你可以將 Logo 區塊抽成獨立元件，例如放在 `components/common/Logo.tsx`：

```tsx
// src/components/common/Logo.tsx
import React from "react";
import { Typography } from "@mui/material";
import logoImage from "../../assets/logo.png"; // 根據實際路徑調整

const Logo: React.FC = () => {
  return (
    <Typography variant="h6" fontWeight="bold">
      <img
        src={logoImage}
        alt="Logo"
        style={{ width: "30px", verticalAlign: "middle", marginRight: "8px" }}
      />
      MyDashboard
    </Typography>
  );
};

export default Logo;
```

然後在 `Sidebar.tsx` 中使用：

```tsx
import Logo from "../common/Logo";

<Box sx={{ mb: 4 }}>
  <Logo />
</Box>
```

---

### ✅ 2. Sidebar 加上路由導頁功能

你可以使用 `react-router-dom` 的 `useNavigate` 或 `<Link>` 元件來實現導頁。以下是兩種方式：

#### 方法一：使用 `useNavigate`

```tsx
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC<SidebarProps> = ({ tocItems }) => {
  const navigate = useNavigate();

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <List>
      {tocItems.map((item, index) => (
        <ListItemButton key={index} onClick={() => handleClick(item.path)}>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
};
```

```ts
// 使用範例
const tocItems = [
  { label: "上傳資料", path: "/upload" },
  { label: "圖表設定", path: "/chart-config" },
  { label: "儀表板", path: "/dashboard" },
  { label: "下載報表", path: "/download" },
];
```

#### 方法二：使用 `<Link>` 元件（更語意化）

```tsx
import { Link } from "react-router-dom";

<List>
  {tocItems.map((item, index) => (
    <ListItemButton key={index} component={Link} to={item.path}>
      <ListItemText primary={item.label} />
    </ListItemButton>
  ))}
</List>
```

---

### 🔧 額外建議

- 若 Sidebar 是 Layout 的一部分，建議在 `Layout.tsx` 中統一處理路由與結構。
- 若你有使用 `RightPanel` 的狀態來控制顯示與否，也可以在 Sidebar 點擊後觸發 `uiStore` 或 `RightPanelContext` 的更新。

---

需要我幫你整合 Sidebar + Layout + 路由的完整範例嗎？還是你想先處理 Sidebar 的部分？

### 推薦三問
- 給我 Sidebar + Layout + 路由整合範例
- Sidebar 點擊時如何同時關閉 RightPanel
- tocItems 要怎麼集中管理比較好

## Copilot 提問 Sidebar + Layout + 路由整合
【已完成】
- Logo 元件抽出
- Sidebar 使用 `<Link>` 元件

【目前問題或需求】
給我 Sidebar + Layout + 路由整合範例

## Copilot 回答 Sidebar + Layout + 路由整合
太好了！既然你已完成 Logo 抽出與 Sidebar 使用 `<Link>`，以下是整合 **Sidebar + Layout + 路由** 的完整範例，符合你目前使用的技術：**Vite + React + MUI + Zustand + TypeScript**。

---

### 📁 專案結構建議（重點部分）

```
src/
├── components/
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopNav.tsx
│       ├── Layout.tsx
├── pages/
│   ├── UploadPage.tsx
│   ├── ChartConfigPage.tsx
│   ├── DashboardPage.tsx
│   └── DownloadPage.tsx
├── App.tsx
├── main.tsx
```

---

### 🧩 Sidebar.tsx（已使用 `<Link>`）

```tsx
// src/components/layout/Sidebar.tsx
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../common/Logo";

const menuItems = [
  { label: "上傳資料", path: "/upload" },
  { label: "圖表設定", path: "/chart-config" },
  { label: "儀表板", path: "/dashboard" },
  { label: "下載報表", path: "/download" },
];

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Logo />
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            sx={{ color: "#fff" }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
```

---

### 🧩 Layout.tsx（整合 Sidebar + TopNav + RightPanel）

```tsx
// src/components/layout/Layout.tsx
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import RightPanel from "./RightPanel";
import { useRightPanel } from "../../context/useRightPanel";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { rightPanelEnabled } = useRightPanel();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopNav />
        <Box sx={{ flexGrow: 1, p: 2 }}>{children}</Box>
      </Box>
      {rightPanelEnabled && <RightPanel />}
    </Box>
  );
};

export default Layout;
```

---

### 🧩 App.tsx（設定路由）

```tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import UploadPage from "./pages/UploadPage";
import ChartConfigPage from "./pages/ChartConfigPage";
import DashboardPage from "./pages/DashboardPage";
import DownloadPage from "./pages/DownloadPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chart-config" element={<ChartConfigPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
```

---

### ✅ 最後提醒

- `RightPanel` 的顯示由 `Zustand` 控制，你已整合 `RightPanelProvider`，這樣就能在 `Layout` 中根據狀態顯示。
- 若你有 `TopNav` 需要加上登出或使用者資訊，也可以在 `Layout.tsx` 中擴充。

---

需要我幫你加上 `active` 樣式（目前選中的選單高亮）或是 `TopNav` 的設計嗎？

### 推薦三問
- Sidebar 加上 active 樣式怎麼做
- TopNav 有推薦設計範例嗎
- RightPanel 狀態切換要怎麼串 Sidebar

## Copilot 提問 頁面設置元件內容
【目前問題或需求】
- 頁面能設置不同的目錄項目、路徑 Breadcrumb 顯示階層、主內容、右側邊欄內容
- 符合需求下，可以改寫代碼

【當前代碼】
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { UploadPage } from "./pages/UploadPage";
import { ChartConfigPage } from "./pages/ChartConfigPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DownloadPage } from "./pages/DownloadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="upload" element={<UploadPage />} />
          <Route path="chart-config" element={<ChartConfigPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="download" element={<DownloadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

```

```tsx
// src/components/layout/Layout.tsx
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";
import { RightPanelProvider } from "../../context/RightPanelProvider";

export const Layout = () => {
  const { rightPanelEnabled } = useUIStore();

  return (
    <RightPanelProvider>
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
    </RightPanelProvider>
  );
};

```

```css
/* components/layout/layout.css */
.layout-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

.sidebar {
    width: 240px;
    background-color: #1e1e2f;
}

.main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.top-nav {
    height: 60px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
}

.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
}

.right-panel {
    width: 300px;
    background-color: #f9f9f9;
    border-left: 1px solid #ddd;
    padding: 16px;
}
```

```tsx
// src/components/layout/TopNav.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    navigate(path);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  return (
    <Box
      sx={{
        height: 60,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        bgcolor: "#fff",
      }}
    >
      {/* Breadcrumb 區塊 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {pathSegments.length > 3 ? (
          <>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(0)}
            >
              {pathSegments[0]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 2)}
            >
              {pathSegments[pathSegments.length - 2]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 1)}
            >
              {pathSegments[pathSegments.length - 1]}
            </Typography>
            <IconButton size="small" onClick={handleMoreClick}>
              <Typography fontSize={12}>...</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMoreClose}
            >
              {pathSegments.slice(1, pathSegments.length - 2).map((seg, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleBreadcrumbClick(i + 1);
                    handleMoreClose();
                  }}
                >
                  {seg}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          pathSegments.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Typography>{">"}</Typography>}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: i === pathSegments.length - 1 ? "bold" : "normal",
                }}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {seg}
              </Typography>
            </React.Fragment>
          ))
        )}
      </Box>

      {/* 搜尋按鈕 */}
      <IconButton onClick={handleSearchOpen}>
        <SearchIcon />
      </IconButton>

      {/* 全螢幕搜尋浮層 */}
      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSearchClose();
            }
          }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <TextField
            autoFocus
            placeholder="請輸入搜尋內容..."
            variant="outlined"
            sx={{ width: "60%", bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

```

```tsx
// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import Logo from "../common/Logo";
import type { TocItem } from "../../types";

interface SidebarProps {
  tocItems: TocItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ tocItems }) => {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Logo 區塊 */}
      <Box sx={{ mb: 4 }}>
        <Logo />
      </Box>

      {/* TOC 區塊 */}
      <List>
        {tocItems.map((item, index) => (
          <ListItemButton key={index} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

```

```tsx
// src/context/RightPanelProvider.tsx
import React from "react";
import { useUIStore } from "../stores/uiStore";
import { RightPanelContext } from "./RightPanelContext";

export const RightPanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setRightPanelContent, setRightPanelEnabled, rightPanelEnabled } = useUIStore();

  const setContent = (content: React.ReactNode) => {
    setRightPanelContent(content);
  };

  const setEnabled = (enabled: boolean) => {
    setRightPanelEnabled(enabled);
    if (!enabled) setRightPanelContent(null); // 清除內容
  };

  const toggleEnabled = () => {
    setRightPanelEnabled(!rightPanelEnabled);
  };

  return (
    <RightPanelContext.Provider value={{ setContent, setEnabled, toggleEnabled }}>
      {children}
    </RightPanelContext.Provider>
  );
};

```

## Copilot 回答 頁面設置元件內容

你目前的架構已經很清楚，接下來要達成的目標是：

> ✅ 每個頁面可以設定：
- 左側目錄項目（Sidebar）
- 路徑階層（Breadcrumb）
- 主內容（Main）
- 右側邊欄內容（RightPanel）

以下是改寫建議與整合方式：

---

### ✅ 一、定義頁面配置型別

建立 `types.ts`：

```ts
// src/types.ts
export interface TocItem {
  label: string;
  path: string;
}

export interface PageConfig {
  tocItems: TocItem[];
  breadcrumb: string[];
  rightPanel?: React.ReactNode;
  content: React.ReactNode;
}
```

---

### ✅ 二、建立 PageWrapper 元件

這個元件會接收 `PageConfig`，並自動設定 Sidebar、Breadcrumb、RightPanel 等。

```tsx
// src/components/layout/PageWrapper.tsx
import React, { useEffect } from "react";
import { useRightPanel } from "../../context/useRightPanel";
import { PageConfig } from "../../types";

export const PageWrapper: React.FC<PageConfig> = ({
  tocItems,
  breadcrumb,
  rightPanel,
  content,
}) => {
  const { setContent, setEnabled } = useRightPanel();

  useEffect(() => {
    if (rightPanel) {
      setContent(rightPanel);
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [rightPanel]);

  return <>{content}</>;
};
```

---

### ✅ 三、改寫 Layout.tsx

讓 Sidebar 接收 `tocItems`，並透過 `Outlet` 傳遞頁面內容。

```tsx
// src/components/layout/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { useUIStore } from "../../stores/uiStore";
import { RightPanelProvider } from "../../context/RightPanelProvider";
import { tocMap } from "../../routes/tocMap"; // 新增的 toc 設定

export const Layout = () => {
  const { rightPanelEnabled } = useUIStore();
  const location = useLocation();
  const tocItems = tocMap[location.pathname] || [];

  return (
    <RightPanelProvider>
      <div className="layout-container">
        <Sidebar tocItems={tocItems} />
        <div className="main-area">
          <TopNav />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
        {rightPanelEnabled && <RightPanel />}
      </div>
    </RightPanelProvider>
  );
};
```

---

### ✅ 四、設定 tocMap

```ts
// src/routes/tocMap.ts
import { TocItem } from "../types";

export const tocMap: Record<string, TocItem[]> = {
  "/upload": [
    { label: "上傳資料", path: "/upload" },
    { label: "圖表設定", path: "/chart-config" },
  ],
  "/chart-config": [
    { label: "圖表設定", path: "/chart-config" },
    { label: "儀表板", path: "/dashboard" },
  ],
  "/dashboard": [
    { label: "儀表板", path: "/dashboard" },
    { label: "下載報表", path: "/download" },
  ],
  "/download": [
    { label: "下載報表", path: "/download" },
  ],
};
```

---

### ✅ 五、改寫頁面範例

```tsx
// src/pages/UploadPage.tsx
import { PageWrapper } from "../components/layout/PageWrapper";
import { TocItem } from "../types";

const tocItems: TocItem[] = [
  { label: "上傳資料", path: "/upload" },
  { label: "圖表設定", path: "/chart-config" },
];

export const UploadPage = () => {
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumb={["上傳資料"]}
      content={<div>這是上傳資料頁面</div>}
      rightPanel={<div>右側說明：如何上傳資料</div>}
    />
  );
};
```

其他頁面也可以用同樣方式改寫。

---

### ✅ 六、Breadcrumb 已支援動態路徑

你已在 `TopNav.tsx` 中使用 `location.pathname` 解析路徑，這部分不需改動，只要 `PageWrapper` 傳入正確的路徑即可。

---

如果你希望 Breadcrumb 顯示中文名稱而不是路徑段落，也可以建立一個 `breadcrumbMap` 來對照。

需要我幫你加上這個對照表嗎？還是你想先試試目前的改寫方式？

### 推薦三問
- 給我 breadcrumbMap 中文名稱對照範例
- PageWrapper 支援動態 rightPanel 內容怎麼做
- Sidebar 如何根據路徑自動高亮選單

## Copilot 提問 PageWrapper 沒有實際作用
PageWrapper 是好用的元件，但 tocItems,  breadcrumb 這兩者 沒有實際作用，如何實現他們

## Copilot 回答 PageWrapper 沒有實際作用
你說得很對，目前 `PageWrapper` 雖然接收了 `tocItems` 和 `breadcrumb`，但它們沒有實際被使用。以下是如何讓這兩個參數真正發揮作用的做法：

---

### ✅ 1. `tocItems` 的實現方式：動態 Sidebar

目前 Sidebar 是在 `Layout.tsx` 中直接使用 `tocMap[location.pathname]` 來取得目錄項目，但如果你希望每個頁面能自訂 `tocItems`，可以改成由 `PageWrapper` 提供。

#### 作法：
- 將 `Sidebar` 移出 `Layout.tsx`，改由 `PageWrapper` 控制。
- 在 `PageWrapper` 中渲染 `Sidebar`，並傳入 `tocItems`。

#### 修改 `Layout.tsx`：
```tsx
// Layout.tsx
export const Layout = () => {
  const { rightPanelEnabled } = useUIStore();

  return (
    <RightPanelProvider>
      <div className="layout-container">
        {/* Sidebar 改由 PageWrapper 控制 */}
        <div className="main-area">
          <TopNav />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
        {rightPanelEnabled && <RightPanel />}
      </div>
    </RightPanelProvider>
  );
};
```

#### 修改 `PageWrapper.tsx`：
```tsx
import { Sidebar } from "./Sidebar";

export const PageWrapper: React.FC<PageConfig> = ({
  tocItems,
  breadcrumb,
  rightPanel,
  content,
}) => {
  const { setContent, setEnabled } = useRightPanel();

  useEffect(() => {
    if (rightPanel) {
      setContent(rightPanel);
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [rightPanel]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar tocItems={tocItems} />
      <div style={{ flex: 1 }}>{content}</div>
    </div>
  );
};
```

---

### ✅ 2. `breadcrumb` 的實現方式：動態 Breadcrumb 顯示

目前 `TopNav.tsx` 是根據 `location.pathname` 自動解析路徑，但如果你希望每個頁面能自訂顯示名稱（例如 `/upload` 顯示「上傳資料」），可以改成使用 `breadcrumb` 陣列。

#### 作法：
- 在 `RightPanelContext` 中新增 `breadcrumb` 狀態。
- 在 `PageWrapper` 中設定 `breadcrumb`。
- 在 `TopNav.tsx` 中使用這個狀態來顯示。

---

#### 修改 `RightPanelContext.tsx`：
```ts
export interface RightPanelContextType {
  setContent: (content: React.ReactNode) => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;
}
```

#### 修改 `RightPanelProvider.tsx`：
```tsx
const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

<RightPanelContext.Provider
  value={{
    setContent,
    setEnabled,
    toggleEnabled,
    breadcrumb,
    setBreadcrumb,
  }}
>
  {children}
</RightPanelContext.Provider>
```

#### 修改 `PageWrapper.tsx`：
```tsx
const { setContent, setEnabled, setBreadcrumb } = useRightPanel();

useEffect(() => {
  setBreadcrumb(breadcrumb);
}, [breadcrumb]);
```

#### 修改 `TopNav.tsx`：
```tsx
const { breadcrumb } = useRightPanel();

<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  {breadcrumb.map((item, i) => (
    <React.Fragment key={i}>
      {i > 0 && <Typography>{" > "}</Typography>}
      <Typography
        sx={{
          cursor: "pointer",
          fontWeight: i === breadcrumb.length - 1 ? "bold" : "normal",
        }}
      >
        {item}
      </Typography>
    </React.Fragment>
  ))}
</Box>
```

---

這樣一來，每個頁面就能透過 `PageWrapper` 自訂：
- 左側目錄（`tocItems`）
- 路徑階層（`breadcrumb`）
- 主內容（`content`）
- 右側欄位（`rightPanel`）

如果你希望我幫你整理成一個完整範例頁面，我可以馬上幫你補上！是否需要？

### 推薦三問
- 給我完整的 PageWrapper 實作範例
- 如何讓 breadcrumb 支援路由跳轉
- Sidebar、TopNav、RightPanel 狀態管理最佳做法

## Copilot 提問 Sidebar + TopNav + RightPanel 狀態管理最佳做法
Sidebar、TopNav、RightPanel 狀態管理最佳做法

既然 RightPanel 可以使用 createContext, useContext 等作法
那麼應該也能用在 Sidebar 的目錄設定 和 TopNav 的 breadcrumb 設定上

是否有辦法一次性管理他們的狀態和 Provider

## Copilot 回答 Sidebar + TopNav + RightPanel 狀態管理最佳做法
非常可以！你完全抓到重點 👍  
既然 `RightPanel` 已經使用 `Context` 管理狀態，那麼 **Sidebar 的目錄設定** 和 **TopNav 的 breadcrumb** 也可以納入同一個 Context 中統一管理，這樣可以：

- 減少多個 Provider 的嵌套
- 提高狀態一致性與可維護性
- 讓 `Layout` 結構更乾淨

---

### ✅ 建議做法：建立 `LayoutContext`

#### 1. 建立 `LayoutContext.tsx`

```tsx
// src/context/LayoutContext.tsx
import React, { createContext, useContext, useState } from "react";
import { TocItem } from "../types";

interface LayoutContextType {
  tocItems: TocItem[];
  setTocItems: (items: TocItem[]) => void;
  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;
  rightPanelContent: React.ReactNode | null;
  setRightPanelContent: (content: React.ReactNode | null) => void;
  rightPanelEnabled: boolean;
  setRightPanelEnabled: (enabled: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode | null>(null);
  const [rightPanelEnabled, setRightPanelEnabled] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        tocItems,
        setTocItems,
        breadcrumb,
        setBreadcrumb,
        rightPanelContent,
        setRightPanelContent,
        rightPanelEnabled,
        setRightPanelEnabled,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayoutContext 必須在 LayoutProvider 中使用");
  return context;
};
```

---

#### 2. 修改 `Layout.tsx` 使用 `LayoutContext`

```tsx
// src/components/layout/Layout.tsx
import { useLayoutContext } from "../../context/LayoutContext";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  const { tocItems, rightPanelEnabled, rightPanelContent } = useLayoutContext();

  return (
    <div className="layout-container">
      <Sidebar tocItems={tocItems} />
      <div className="main-area">
        <TopNav />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      {rightPanelEnabled && <RightPanel>{rightPanelContent}</RightPanel>}
    </div>
  );
};
```

---

#### 3. 修改 `PageWrapper.tsx` 設定所有狀態

```tsx
// src/components/layout/PageWrapper.tsx
import { useLayoutContext } from "../../context/LayoutContext";
import { PageConfig } from "../../types";

export const PageWrapper: React.FC<PageConfig> = ({
  tocItems,
  breadcrumb,
  rightPanel,
  content,
}) => {
  const {
    setTocItems,
    setBreadcrumb,
    setRightPanelContent,
    setRightPanelEnabled,
  } = useLayoutContext();

  useEffect(() => {
    setTocItems(tocItems);
    setBreadcrumb(breadcrumb);
    if (rightPanel) {
      setRightPanelContent(rightPanel);
      setRightPanelEnabled(true);
    } else {
      setRightPanelEnabled(false);
      setRightPanelContent(null);
    }
  }, [tocItems, breadcrumb, rightPanel]);

  return <>{content}</>;
};
```

---

#### 4. 修改 `TopNav.tsx` 使用 breadcrumb 狀態

```tsx
import { useLayoutContext } from "../../context/LayoutContext";

const { breadcrumb } = useLayoutContext();

{/* 顯示 breadcrumb */}
{breadcrumb.map((item, i) => (
  <React.Fragment key={i}>
    {i > 0 && <Typography>{" > "}</Typography>}
    <Typography
      sx={{
        cursor: "pointer",
        fontWeight: i === breadcrumb.length - 1 ? "bold" : "normal",
      }}
    >
      {item}
    </Typography>
  </React.Fragment>
))}
```

---

#### 5. 在 `App.tsx` 中包住 `LayoutProvider`

```tsx
import { LayoutProvider } from "./context/LayoutContext";

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 子路由 */}
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}
```

---

### ✅ 優點總結

| 狀態項目    | 原本方式            | 改進後方式（集中管理） |
| ----------- | ------------------- | ---------------------- |
| Sidebar toc | `tocMap` 或 props   | `LayoutContext`        |
| Breadcrumb  | `location.pathname` | `LayoutContext`        |
| RightPanel  | `Zustand` + Context | `LayoutContext`        |

---

如果你希望 `LayoutContext` 內部仍使用 Zustand 來管理狀態，也可以混合使用。需要我幫你改成 Zustand 版本嗎？

### 推薦三問
- 幫我改成用 Zustand 管理 LayoutContext 狀態
- 給我完整 LayoutContext + PageWrapper 範例
- 如何在頁面切換時自動重設 breadcrumb 和右側內容

## Copilot 提問 Zustand管理LayoutContext 改TopNav
首先幫我改成用 Zustand 管理 LayoutContext 狀態，然後幫我改 TopNav

```tsx
// src/components/layout/TopNav.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayoutContext } from "../../context/useLayoutContext";

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { breadcrumb } = useLayoutContext();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    navigate(path);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  return (
    <Box
      sx={{
        height: 60,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        bgcolor: "#fff",
      }}
    >
      {/* Breadcrumb 區塊 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {pathSegments.length > 3 ? (
          <>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(0)}
            >
              {pathSegments[0]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 2)}
            >
              {pathSegments[pathSegments.length - 2]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 1)}
            >
              {pathSegments[pathSegments.length - 1]}
            </Typography>
            <IconButton size="small" onClick={handleMoreClick}>
              <Typography fontSize={12}>...</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMoreClose}
            >
              {pathSegments.slice(1, pathSegments.length - 2).map((seg, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleBreadcrumbClick(i + 1);
                    handleMoreClose();
                  }}
                >
                  {seg}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          pathSegments.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Typography>{">"}</Typography>}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: i === pathSegments.length - 1 ? "bold" : "normal",
                }}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {seg}
              </Typography>
            </React.Fragment>
          ))
        )}
      </Box>

      {/* 搜尋按鈕 */}
      <IconButton onClick={handleSearchOpen}>
        <SearchIcon />
      </IconButton>

      {/* 全螢幕搜尋浮層 */}
      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSearchClose();
            }
          }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <TextField
            autoFocus
            placeholder="請輸入搜尋內容..."
            variant="outlined"
            sx={{ width: "60%", bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
```

## Copilot 回答 Zustand管理LayoutContext 改TopNav

你想將 `LayoutContext` 改為使用 Zustand 管理，並讓 `TopNav` 使用 breadcrumb 狀態，這是非常合理的做法。以下是完整改寫步驟：

---

### ✅ 一、建立 Zustand 狀態管理：`layoutStore.ts`

```ts
// src/stores/layoutStore.ts
import { create } from "zustand";
import { TocItem } from "../types";

interface LayoutState {
  tocItems: TocItem[];
  setTocItems: (items: TocItem[]) => void;

  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;

  rightPanelContent: React.ReactNode | null;
  setRightPanelContent: (content: React.ReactNode | null) => void;

  rightPanelEnabled: boolean;
  setRightPanelEnabled: (enabled: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  tocItems: [],
  setTocItems: (items) => set({ tocItems: items }),

  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),

  rightPanelContent: null,
  setRightPanelContent: (content) => set({ rightPanelContent: content }),

  rightPanelEnabled: false,
  setRightPanelEnabled: (enabled) => set({ rightPanelEnabled: enabled }),
}));
```

---

### ✅ 二、改寫 `TopNav.tsx` 使用 `useLayoutStore`

```tsx
// src/components/layout/TopNav.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../../stores/layoutStore";

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const breadcrumb = useLayoutStore((state) => state.breadcrumb);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + breadcrumb.slice(0, index + 1).join("/");
    navigate(path);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  return (
    <Box
      sx={{
        height: 60,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        bgcolor: "#fff",
      }}
    >
      {/* Breadcrumb 區塊 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {breadcrumb.length > 3 ? (
          <>
            <Typography sx={{ cursor: "pointer" }} onClick={() => handleBreadcrumbClick(0)}>
              {breadcrumb[0]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(breadcrumb.length - 2)}
            >
              {breadcrumb[breadcrumb.length - 2]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(breadcrumb.length - 1)}
            >
              {breadcrumb[breadcrumb.length - 1]}
            </Typography>
            <IconButton size="small" onClick={handleMoreClick}>
              <Typography fontSize={12}>...</Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMoreClose}>
              {breadcrumb.slice(1, breadcrumb.length - 2).map((seg, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleBreadcrumbClick(i + 1);
                    handleMoreClose();
                  }}
                >
                  {seg}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          breadcrumb.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Typography>{">"}</Typography>}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: i === breadcrumb.length - 1 ? "bold" : "normal",
                }}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {seg}
              </Typography>
            </React.Fragment>
          ))
        )}
      </Box>

      {/* 搜尋按鈕 */}
      <IconButton onClick={handleSearchOpen}>
        <SearchIcon />
      </IconButton>

      {/* 全螢幕搜尋浮層 */}
      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSearchClose();
            }
          }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <TextField
            autoFocus
            placeholder="請輸入搜尋內容..."
            variant="outlined"
            sx={{ width: "60%", bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
```

---

### ✅ 三、後續建議

- `Sidebar.tsx` 也可以改用 `useLayoutStore` 取得 `tocItems`
- `PageWrapper.tsx` 可直接設定 `setTocItems`, `setBreadcrumb`, `setRightPanelContent`, `setRightPanelEnabled`

是否需要我幫你一起改 `Sidebar.tsx` 和 `PageWrapper.tsx`？還是你想先試試這部分？

### 推薦三問
- Sidebar.tsx 也改用 useLayoutStore 實作
- PageWrapper.tsx 怎麼串接 setTocItems 等
- 給完整 Zustand + Context 架構範例

## Copilot 提問 給完整 Zustand + Context 架構範例
給完整 Zustand + Context 架構範例

## Copilot 回答 給完整 Zustand + Context 架構範例

以下是完整的 **Zustand + Context 架構範例**，適用於你目前的 React 專案（Vite + React + MUI + TypeScript），用來集中管理 Layout 狀態：Sidebar 目錄、Breadcrumb 路徑、RightPanel 顯示與內容。

---

### ✅ 1. 建立 Zustand 狀態管理：`layoutStore.ts`

```ts
// src/stores/layoutStore.ts
import { create } from "zustand";
import { TocItem } from "../types";

interface LayoutState {
  tocItems: TocItem[];
  setTocItems: (items: TocItem[]) => void;

  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;

  rightPanelContent: React.ReactNode | null;
  setRightPanelContent: (content: React.ReactNode | null) => void;

  rightPanelEnabled: boolean;
  setRightPanelEnabled: (enabled: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  tocItems: [],
  setTocItems: (items) => set({ tocItems: items }),

  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),

  rightPanelContent: null,
  setRightPanelContent: (content) => set({ rightPanelContent: content }),

  rightPanelEnabled: false,
  setRightPanelEnabled: (enabled) => set({ rightPanelEnabled: enabled }),
}));
```

---

### ✅ 2. 建立 Context 包裝：`LayoutContext.tsx`

```tsx
// src/context/LayoutContext.tsx
import React, { createContext, useContext } from "react";
import { useLayoutStore } from "../stores/layoutStore";

export const LayoutContext = createContext<ReturnType<typeof useLayoutStore> | null>(null);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useLayoutStore();
  return <LayoutContext.Provider value={store}>{children}</LayoutContext.Provider>;
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("useLayoutContext 必須在 LayoutProvider 中使用");
  return context;
};
```

---

### ✅ 3. 使用範例：`PageWrapper.tsx`

```tsx
// src/components/layout/PageWrapper.tsx
import { useLayoutContext } from "../../context/LayoutContext";
import { PageConfig } from "../../types";
import { useEffect } from "react";

export const PageWrapper: React.FC<PageConfig> = ({
  tocItems,
  breadcrumb,
  rightPanel,
  content,
}) => {
  const {
    setTocItems,
    setBreadcrumb,
    setRightPanelContent,
    setRightPanelEnabled,
  } = useLayoutContext();

  useEffect(() => {
    setTocItems(tocItems);
    setBreadcrumb(breadcrumb);
    if (rightPanel) {
      setRightPanelContent(rightPanel);
      setRightPanelEnabled(true);
    } else {
      setRightPanelContent(null);
      setRightPanelEnabled(false);
    }
  }, [tocItems, breadcrumb, rightPanel]);

  return <>{content}</>;
};
```

---

### ✅ 4. 使用範例：`TopNav.tsx`

```tsx
// src/components/layout/TopNav.tsx
import { useLayoutContext } from "../../context/LayoutContext";
const { breadcrumb } = useLayoutContext();

// 顯示 breadcrumb
breadcrumb.map((item, i) => (
  <Typography key={i} onClick={() => navigateTo(i)}>
    {item}
  </Typography>
));
```

---

### ✅ 5. 使用範例：`Sidebar.tsx`

```tsx
// src/components/layout/Sidebar.tsx
import { useLayoutContext } from "../../context/LayoutContext";
const { tocItems } = useLayoutContext();

// 顯示目錄
tocItems.map((item) => (
  <ListItemButton key={item.path} to={item.path}>
    {item.label}
  </ListItemButton>
));
```

---

### ✅ 6. 在 `App.tsx` 中包住 Provider

```tsx
// src/App.tsx
import { LayoutProvider } from "./context/LayoutContext";

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* 子路由 */}
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}
```

---

### ✅ 優點

| 狀態項目    | 管理方式          |
| ----------- | ----------------- |
| Sidebar toc | Zustand + Context |
| Breadcrumb  | Zustand + Context |
| RightPanel  | Zustand + Context |

---

如果你希望這個架構支援 SSR 或 persist（儲存到 localStorage），也可以加上 `zustand/middleware`。需要我幫你加上嗎？

