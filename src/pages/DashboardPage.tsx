// src/pages/DashboardPage.tsx
import { Typography } from "@mui/material";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLayoutContext } from "../context/useLayoutContext";
import { tocMap } from "../routes/tocMap";
import type { TocItem } from "../types";

const tocItems: TocItem[] = tocMap["/dashboard"] || [];

export const DashboardPage: React.FC = () => {
  const { toggleRightPanelEnabled, setTocItems } = useLayoutContext();
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumb={[
        "儀表板1",
        "儀表板2",
        "儀表板3",
        "儀表板4",
        "儀表板5",
        "儀表板6",
      ]}
      content={
        <div>
          主內容區塊
          <button
            onClick={() => {
              toggleRightPanelEnabled();
            }}
          >
            測試用:右側邊欄開關
          </button>
          <button
            onClick={() => {
              setTocItems([...tocItems, { label: "測試用", path: "/test" }]);
            }}
          >
            測試用:加入目錄
          </button>
        </div>
      }
      rightPanel={
        <div>
          <Typography variant="h6">儀表板右側內容</Typography>
          <p>這裡可以放圖表設定、說明、連結等。</p>
        </div>
      }
    />
  );
};
