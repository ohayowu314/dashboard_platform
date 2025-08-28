// src/routes/tocMap.ts
import type { TocItem } from "../types";

export const tocMap: Record<string, TocItem[]> = {
  "/": [
    { label: "上傳資料", path: "/upload" },
    { label: "圖表設定", path: "/chart-config" },
    { label: "儀表板", path: "/dashboard" },
    { label: "下載報表", path: "/download" },
  ],
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
  "/download": [{ label: "下載報表", path: "/download" }],
};
