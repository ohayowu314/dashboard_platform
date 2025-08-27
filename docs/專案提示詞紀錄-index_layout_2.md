## Copilot 提問 Layout+RightPanel 滑入偵測區域與釘選功能衝突
🧩 專案背景：
- 使用技術：Vite + React + MUI + Zustand + TypeScript
- 專案類型：資料視覺化儀表板
- 目前架構：
  src/
  ├── components/layout/Sidebar.tsx, TopNav.tsx, RightPanel.tsx, Layout.tsx
  ├── pages/UploadPage.tsx, ChartConfigPage.tsx, DashboardPage.tsx, DownloadPage.tsx
  ├── stores/uiStore.ts
  ├── types.ts
  ├── utils.ts
  └── App.tsx

🧱 已完成項目：
- TopNav：含麵包屑與搜尋浮層
- RightPanel：滑入顯示、Zustand 控制顯示與釘選
- Layout：使用 CSS class 排版，含滑入偵測區域

🔧 目前狀態：
- 使用 Zustand 管理 `rightPanelEnabled`, `rightPanelVisible`, `rightPanelPinned`
- CSS 控制 `.right-panel.visible` 滑入效果
- 釘選功能已完成

❓接下來想處理的問題：
RightPanel 滑入效果並不理想：
- 滑入偵測區域如果在 RightPanel 之上，RightPanel 的釘選無法點擊
- 滑入偵測區域如果在 RightPanel 之下，無法偵測滑鼠懸停

## Copilot 回答 Layout+RightPanel 滑入偵測區域與釘選功能衝突
感謝詳細的說明！你目前的架構與狀態整理得非常清楚 👍

針對你遇到的 **RightPanel 滑入偵測區域與釘選功能衝突** 問題，這是常見的 UI/UX 行為衝突，以下是幾種解法與建議：

---

### 🧠 問題分析

你目前的需求是：
1. 滑鼠懸停在偵測區域時，RightPanel 滑入顯示。
2. RightPanel 被釘選時，使用者仍能操作其內容（不被偵測區域遮蔽）。

但這兩者的區域可能重疊，導致：
- 偵測區域在上層 → RightPanel 無法點擊。
- 偵測區域在下層 → 無法偵測滑鼠懸停。

---

### ✅ 解法建議

#### 方法一：使用透明區域 + pointer-events 控制
讓偵測區域在上層，但不阻擋點擊：

```css
.hover-detector {
  position: fixed;
  top: 0;
  right: 0;
  width: 20px;
  height: 100vh;
  z-index: 1000;
  pointer-events: auto;
}

.right-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  z-index: 999;
}

.right-panel.pinned {
  z-index: 1001; /* 高於偵測區域 */
}
```

並在 `hover-detector` 上加上事件監聽：

```tsx
<div
  className="hover-detector"
  onMouseEnter={() => setRightPanelVisible(true)}
  onMouseLeave={() => {
    if (!rightPanelPinned) setRightPanelVisible(false);
  }}
/>
```

#### 方法二：偵測滑鼠位置而非懸停區域
使用 `mousemove` 事件判斷滑鼠是否靠近右側邊緣：

```tsx
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const threshold = 20;
    const nearRightEdge = window.innerWidth - e.clientX < threshold;
    if (nearRightEdge) {
      setRightPanelVisible(true);
    } else if (!rightPanelPinned) {
      setRightPanelVisible(false);
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [rightPanelPinned]);
```

這樣就不需要額外的偵測區域元素，也不會干擾 RightPanel 的操作。

---

### 🔧 額外建議

- 若 RightPanel 是釘選狀態，建議完全停用滑入偵測，避免干擾使用者操作。
- 可考慮在 RightPanel 外層加上 `pointer-events: none`，內層再開啟 `pointer-events: auto`，更細緻控制互動區域。

---

需要我幫你整合成一個完整的元件範例嗎？或者你想先試試其中一種方法？

推薦三問
- 幫我整合成完整元件範例
- 想看 pointer-events 控制的詳細寫法
- mousemove 方案有沒有潛在副作用

## Copilot 提問 Layout+RightPanel 滑入偵測區域與釘選功能衝突 具體要求
> 重新開一頁問，因為發覺還需要更多提示

### 🧩 專案背景：
- 使用技術：Vite + React + MUI + Zustand + TypeScript
- 專案類型：資料視覺化儀表板
- 目前架構：
  src/
  ├── components/layout/Sidebar.tsx, TopNav.tsx, RightPanel.tsx, Layout.tsx
  ├── pages/UploadPage.tsx, ChartConfigPage.tsx, DashboardPage.tsx, DownloadPage.tsx
  ├── stores/uiStore.ts
  ├── types.ts
  ├── utils.ts
  └── App.tsx

### 🧱 已完成項目：
- TopNav：含麵包屑與搜尋浮層
- RightPanel：滑入顯示、Zustand 控制顯示與釘選
- Layout：使用 CSS class 排版，含滑入偵測區域

### 🔧 目前狀態：
- 使用 Zustand 管理 `rightPanelEnabled`, `rightPanelVisible`, `rightPanelPinned`
- CSS 控制 `.right-panel.visible` 滑入效果
- 釘選功能已完成

### ❓接下來想處理的問題：
RightPanel 滑入效果並不理想：
- 滑入偵測區域如果在 RightPanel 之上，RightPanel 的釘選無法點擊
- 滑入偵測區域如果在 RightPanel 之下，無法偵測滑鼠懸停

我的 RightPanel 將來會有內容和超連結可以點按，所以我希望 RightPanel 不論是否釘選，只要滑鼠還在其上，就必須顯示。

具體要求
- 不同頁面可以選擇是否啟用 RightPanel，並注入內容
- 不啟用 RightPanel 時，沒有此元件
- 啟用 RightPanel 時，平時不顯示，當滑鼠滑至右側，會顯示 RightPanel，並且其內部元件可以使用。
- 當滑鼠在 RightPanel 上時，RightPanel 會持續顯示。
- 當滑鼠離開 RightPanel 時，RightPanel 會消失。
- 如果在 RightPanel 顯示的狀態下點擊釘選圖示，滑鼠離開不會讓 RightPanel 消失，依舊持續顯示。
- 再次點擊釘選圖示，取消釘選，此時滑鼠離開 RightPanel 時，RightPanel 會消失。
- 釘選效果橫跨所有有開啟 RightPanel 的頁面

### 檔案當前內容
```tsx
// components/layout/Layout.tsx
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";

export const Layout = () => {
  const {
    rightPanelEnabled,
    rightPanelVisible,
    rightPanelPinned,
    setRightPanelVisible,
  } = useUIStore();

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-area">
        <TopNav />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      {/* 滑入偵測區域 */}
      {rightPanelEnabled && !rightPanelPinned && (
        <div
          className={`right-hover-zone ${rightPanelVisible ? "visible" : ""}`}
          onMouseEnter={() => setRightPanelVisible(true)}
          onMouseLeave={() => setRightPanelVisible(false)}
        />
      )}

      {rightPanelEnabled && <RightPanel />}
    </div>
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
    position: fixed;
    right: 0;
    top: 60px;
    width: 300px;
    height: calc(100vh - 60px);
    background-color: #f9f9f9;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
}

.right-panel.visible {
    transform: translateX(0);
}

/* 右側滑入偵測區域 */
.right-hover-zone {
    position: fixed;
    top: 60px;
    /* 避開 TopNav */
    right: 0;
    width: 30px;
    height: calc(100vh - 60px);
    z-index: 1100;
    background-color: transparent;
}

.right-hover-zone.visible {
    width: 300px;
    /* background-color: rgba(0, 0, 0, 0.05); */
}
```

```tsx
// components/layout/RightPanel.tsx
import React from "react";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";
import { IconButton } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

export const RightPanel: React.FC = () => {
  const {
    rightPanelEnabled,
    rightPanelVisible,
    rightPanelContent,
    rightPanelPinned,
    setRightPanelPinned,
  } = useUIStore();

  if (!rightPanelEnabled) return null;

  return (
    <div
      className={`right-panel ${rightPanelVisible || rightPanelPinned ? "visible" : ""}`}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "4px" }}
      >
        <IconButton
          size="small"
          onClick={() => {
            setRightPanelPinned(!rightPanelPinned);
            console.log("rightPanelPinned:", !rightPanelPinned);
          }}
          title={rightPanelPinned ? "取消釘選" : "釘選面板"}
        >
          <PushPinIcon color={rightPanelPinned ? "primary" : "disabled"} />
        </IconButton>
      </div>
      <div style={{ padding: "8px" }}>{rightPanelContent}</div>
    </div>
  );
};
```

```tsx
// stores/uiStore.ts
import { create } from "zustand";

interface UIState {
  rightPanelEnabled: boolean;
  rightPanelContent: React.ReactNode;
  setRightPanelEnabled: (enabled: boolean) => void;
  setRightPanelContent: (content: React.ReactNode) => void;
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
  rightPanelPinned: boolean;
  setRightPanelPinned: (pinned: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelEnabled: true,
  rightPanelContent: null,
  setRightPanelEnabled: (enabled) => set({ rightPanelEnabled: enabled }),
  setRightPanelContent: (content) => set({ rightPanelContent: content }),
  rightPanelVisible: false,
  setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
  rightPanelPinned: false,
  setRightPanelPinned: (pinned) => set({ rightPanelPinned: pinned }),
}));
```

可以取消掉滑入偵測區 改用 滑鼠位置

## Copilot 回答 Layout+RightPanel 滑入偵測區域與釘選功能衝突 具體要求
你目前的架構已經很清楚，釘選功能也處理得不錯 👍  
針對你想「取消滑入偵測區，改用滑鼠位置」來控制 RightPanel 顯示，這是個更精準且使用者友善的方式。以下是完整的改法建議：

---

### ✅ 改用滑鼠位置偵測 RightPanel 顯示

#### 1. **新增滑鼠位置監聽邏輯**
在 `Layout.tsx` 中使用 `useEffect` 搭配 `mousemove` 事件，判斷滑鼠是否在右側邊界或 RightPanel 上。

```tsx
import { useEffect } from "react";

export const Layout = () => {
  const {
    rightPanelEnabled,
    rightPanelVisible,
    rightPanelPinned,
    setRightPanelVisible,
  } = useUIStore();

  useEffect(() => {
    if (!rightPanelEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const panelWidth = 300;
      const threshold = 30;
      const x = e.clientX;

      const isNearRightEdge = window.innerWidth - x <= threshold;
      const isOverPanel = x >= window.innerWidth - panelWidth;

      if (rightPanelPinned) return;

      if (isNearRightEdge || isOverPanel) {
        setRightPanelVisible(true);
      } else {
        setRightPanelVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rightPanelEnabled, rightPanelPinned, setRightPanelVisible]);
```

---

#### 2. **移除滑入偵測區**
你可以直接刪除這段：

```tsx
{rightPanelEnabled && !rightPanelPinned && (
  <div
    className={`right-hover-zone ${rightPanelVisible ? "visible" : ""}`}
    onMouseEnter={() => setRightPanelVisible(true)}
    onMouseLeave={() => setRightPanelVisible(false)}
  />
)}
```

以及 CSS 中的 `.right-hover-zone` 相關樣式。

---

#### 3. **RightPanel 保持互動性**
你的 `RightPanel.tsx` 已經有 `rightPanelPinned` 控制邏輯，這部分不需改動。只要確保 `RightPanel` 本身的 `z-index` 高於其他元素（例如 `TopNav`），以避免被遮住。

建議加上：

```css
.right-panel {
  z-index: 1200;
}
```

---

#### 4. **釘選狀態跨頁維持**
目前 `uiStore.ts` 是全域的 Zustand store，釘選狀態會自動跨頁維持。如果你希望在重新整理後也保留釘選狀態，可以加上 localStorage：

```ts
setRightPanelPinned: (pinned) => {
  localStorage.setItem("rightPanelPinned", JSON.stringify(pinned));
  set({ rightPanelPinned: pinned });
},
```

並在 store 初始化時讀取：

```ts
rightPanelPinned: JSON.parse(localStorage.getItem("rightPanelPinned") || "false"),
```

---

### ✅ 最終效果
- 滑鼠移至右側邊界或 RightPanel 上 → 顯示 RightPanel
- 滑鼠離開 → 隱藏（若未釘選）
- 點擊釘選 → 永遠顯示
- 再次點擊釘選 → 回到滑鼠控制
- 不同頁面可選擇是否啟用 RightPanel

---

需要我幫你整理成 PR-ready 的 commit 或是幫你拆分成多個元件嗎？還是你想進一步優化內容注入的方式？

推薦三問
- 幫我整理成 PR-ready commit 訊息
- 內容注入有推薦的最佳做法嗎
- 怎麼讓 RightPanel 支援不同頁面自訂內容

## Copilot 提問 Layout+RightPanel 推薦三問 commit 內容注入最佳做法 RightPanel支援自訂內容
- 幫我整理成 PR-ready commit 訊息
- 內容注入有推薦的最佳做法嗎
- 怎麼讓 RightPanel 支援不同頁面自訂內容

## Copilot 回答 Layout+RightPanel 推薦三問 commit 內容注入最佳做法 RightPanel支援自訂內容
很棒的問題！我來幫你整理成三個部分：

---

### ✅ PR-ready Commit 訊息建議

你這次的改動可以拆成兩個 commit：

#### 1. 移除滑入偵測區，改用滑鼠位置控制 RightPanel 顯示
```bash
feat(ui): 改用滑鼠位置控制 RightPanel 顯示，移除滑入偵測區

- 移除 .right-hover-zone 元件與相關 CSS
- 在 Layout.tsx 中加入 mousemove 事件監聽
- 根據滑鼠位置動態控制 rightPanelVisible 狀態
- 保留釘選邏輯，釘選時不受滑鼠位置影響
```

#### 2. 儲存釘選狀態至 localStorage，跨頁與重整維持狀態
```bash
feat(ui): 儲存 RightPanel 釘選狀態至 localStorage

- 初始化時讀取 localStorage 中的 rightPanelPinned
- 點擊釘選按鈕時同步更新 localStorage
- 釘選狀態在頁面重整後仍可維持
```

---

### ✅ RightPanel 內容注入最佳做法

目前你是用 Zustand 的 `rightPanelContent: React.ReactNode` 來注入內容，這是簡單有效的方式，但有幾個可以優化的方向：

#### 建議做法：使用 **React Portal + Context**

1. **Portal**：讓 RightPanel 的內容可以在任意頁面元件中注入，不受 DOM 層級限制。
2. **Context**：提供 `setRightPanelContent()` 的 hook，讓頁面元件可以方便地設定內容。

例如：

```tsx
// RightPanelProvider.tsx
const RightPanelContext = createContext({ setContent: (c: React.ReactNode) => {} });

export const RightPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const { setRightPanelContent } = useUIStore();

  const setContent = (content: React.ReactNode) => {
    setRightPanelContent(content);
  };

  return (
    <RightPanelContext.Provider value={{ setContent }}>
      {children}
    </RightPanelContext.Provider>
  );
};

export const useRightPanel = () => useContext(RightPanelContext);
```

然後在頁面中使用：

```tsx
const { setContent } = useRightPanel();

useEffect(() => {
  setContent(<MyPanelContent />);
}, []);
```

---

### ✅ 支援不同頁面自訂 RightPanel 內容

你已經有 `rightPanelEnabled` 和 `rightPanelContent`，只要在每個頁面中：

1. **進入頁面時設定內容與啟用狀態**
2. **離開頁面時清除內容與停用**

範例：

```tsx
import { useEffect } from "react";
import { useUIStore } from "../stores/uiStore";
import { MyPanelContent } from "../components/MyPanelContent";

export const DashboardPage = () => {
  const { setRightPanelEnabled, setRightPanelContent } = useUIStore();

  useEffect(() => {
    setRightPanelEnabled(true);
    setRightPanelContent(<MyPanelContent />);

    return () => {
      setRightPanelEnabled(false);
      setRightPanelContent(null);
    };
  }, []);

  return <div>這是 Dashboard</div>;
};
```

這樣每個頁面都可以自由控制 RightPanel 是否啟用與內容。

---

需要我幫你把這些整理成一個 `RightPanelProvider` 元件或是建立一個 hook 來簡化頁面設定嗎？還是你想進一步支援 lazy loading 或 async content？

推薦三問
- 幫我寫 RightPanelProvider 元件範例
- 如何用 hook 簡化 RightPanel 設定
- RightPanel 支援 lazy loading 怎麼做

## Copilot 提問 Layout+RightPanel 幫我寫 RightPanelProvider 元件範例
幫我寫 RightPanelProvider 元件範例

## Copilot 回答 Layout+RightPanel 幫我寫 RightPanelProvider 元件範例
當然可以！以下是完整的 `RightPanelProvider` 元件範例，讓你在任何頁面中都能透過 context API 注入 RightPanel 的內容與控制其啟用狀態。

---

### 📦 檔案結構建議

你可以新增一個 context 檔案：

```
src/
├── context/
│   └── RightPanelContext.tsx
```

---

### 🧩 `RightPanelContext.tsx`

```tsx
import React, { createContext, useContext } from "react";
import { useUIStore } from "../stores/uiStore";

interface RightPanelContextType {
  setContent: (content: React.ReactNode) => void;
  setEnabled: (enabled: boolean) => void;
}

const RightPanelContext = createContext<RightPanelContextType>({
  setContent: () => {},
  setEnabled: () => {},
});

export const RightPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const { setRightPanelContent, setRightPanelEnabled } = useUIStore();

  const setContent = (content: React.ReactNode) => {
    setRightPanelContent(content);
  };

  const setEnabled = (enabled: boolean) => {
    setRightPanelEnabled(enabled);
    if (!enabled) setRightPanelContent(null); // 清除內容
  };

  return (
    <RightPanelContext.Provider value={{ setContent, setEnabled }}>
      {children}
    </RightPanelContext.Provider>
  );
};

export const useRightPanel = () => useContext(RightPanelContext);
```

---

### 🧪 使用範例（在頁面中）

```tsx
import { useEffect } from "react";
import { useRightPanel } from "../context/RightPanelContext";
import { Typography } from "@mui/material";

export const DashboardPage = () => {
  const { setContent, setEnabled } = useRightPanel();

  useEffect(() => {
    setEnabled(true);
    setContent(
      <div>
        <Typography variant="h6">儀表板右側內容</Typography>
        <p>這裡可以放圖表設定、說明、連結等。</p>
      </div>
    );

    return () => {
      setEnabled(false);
    };
  }, []);

  return <div>這是 Dashboard 頁面</div>;
};
```

---

### ✅ 使用建議

- 在 `App.tsx` 或 `Layout.tsx` 外層包住 `<RightPanelProvider>`，讓所有頁面都能使用 `useRightPanel()`。
- 每個頁面都可以自由設定 RightPanel 的內容與是否啟用。
- 若要支援 lazy content，可搭配 `useState` 或 `Suspense`。

---

需要我幫你加上 loading 狀態或是支援 async content 嗎？還是你想讓 RightPanel 支援 tab 或多段內容切換？

推薦三問
- 加上 RightPanel lazy loading 範例
- RightPanel 支援 async content 怎麼做
- 想要 RightPanel 有 tab 切換怎麼設計

## Copilot 提問 Layout+RightPanel useRightPanel ESLint 錯誤
Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.eslint(react-refresh/only-export-components)

## Copilot 回答 Layout+RightPanel useRightPanel ESLint 錯誤
這個 ESLint 錯誤訊息：

> **Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.**  
> `eslint(react-refresh/only-export-components)`

是來自於 React Fast Refresh 的限制：**若一個檔案同時 export React 元件與非元件（例如函式、常數），可能會導致 hot reload 失效或行為不一致。**

---

### ✅ 解法：將非元件邏輯抽出到獨立檔案

例如你有這樣的檔案：

```tsx
// src/components/MyComponent.tsx
export const MY_CONSTANT = 123;

export const MyComponent = () => {
  return <div>{MY_CONSTANT}</div>;
};
```

請改成：

```tsx
// src/constants/myConstants.ts
export const MY_CONSTANT = 123;
```

```tsx
// src/components/MyComponent.tsx
import { MY_CONSTANT } from "../constants/myConstants";

export const MyComponent = () => {
  return <div>{MY_CONSTANT}</div>;
};
```

---

### ✅ 適用情境

- **常數**（如 `enum`, `string`, `number`）
- **工具函式**（如 `formatDate`, `calculateTotal`）
- **Zustand store**（建議獨立在 `stores/` 資料夾）
- **Context provider**（如 `RightPanelProvider`）

---

需要我幫你檢查哪些檔案可能違反這個規則，或幫你重構成乾淨的結構嗎？

推薦三問
- 幫我檢查專案還有哪些檔案違反這個規則
- 協助重構 RightPanelProvider 相關檔案結構
- 有哪些常見情境會踩到這個 eslint 規則

## Copilot 提問 Layout+RightPanel 協助重構 RightPanelProvider 相關檔案結構
協助重構 RightPanelProvider 相關檔案結構

## Copilot 回答 Layout+RightPanel 協助重構 RightPanelProvider 相關檔案結構

以下是針對 `RightPanelProvider` 重構後的建議檔案結構與內容，符合 ESLint 的 `react-refresh/only-export-components` 規則，並提升可維護性與模組化程度：

---

## 📁 建議檔案結構

```
src/
├── context/
│   ├── RightPanelContext.tsx         // Context 元件與 Provider
│   └── useRightPanel.ts              // 自訂 Hook（只 export 函式）
├── stores/
│   └── uiStore.ts                    // Zustand 狀態管理
├── components/
│   └── layout/
│       └── RightPanel.tsx            // RightPanel UI 元件
```

---

## 📄 `RightPanelContext.tsx`

```tsx
import React, { createContext } from "react";
import { useUIStore } from "../stores/uiStore";

interface RightPanelContextType {
  setContent: (content: React.ReactNode) => void;
  setEnabled: (enabled: boolean) => void;
}

export const RightPanelContext = createContext<RightPanelContextType>({
  setContent: () => {},
  setEnabled: () => {},
});

export const RightPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const { setRightPanelContent, setRightPanelEnabled } = useUIStore();

  const setContent = (content: React.ReactNode) => {
    setRightPanelContent(content);
  };

  const setEnabled = (enabled: boolean) => {
    setRightPanelEnabled(enabled);
    if (!enabled) setRightPanelContent(null);
  };

  return (
    <RightPanelContext.Provider value={{ setContent, setEnabled }}>
      {children}
    </RightPanelContext.Provider>
  );
};
```

---

## 📄 `useRightPanel.ts`

```tsx
import { useContext } from "react";
import { RightPanelContext } from "./RightPanelContext";

export const useRightPanel = () => useContext(RightPanelContext);
```

> ✅ 此檔案只 export hook 函式，符合 Fast Refresh 要求。

---

## ✅ 使用方式（頁面中）

```tsx
import { useEffect } from "react";
import { useRightPanel } from "../context/useRightPanel";

export const DashboardPage = () => {
  const { setContent, setEnabled } = useRightPanel();

  useEffect(() => {
    setEnabled(true);
    setContent(<div>這是 Dashboard 的右側內容</div>);

    return () => {
      setEnabled(false);
    };
  }, []);

  return <div>Dashboard Page</div>;
};
```

---

需要我幫你加上 lazy loading 或 tab 切換功能嗎？也可以幫你整合 MUI 的 Drawer 或 Popover 元件來強化互動性喔！

