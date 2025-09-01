// src/pages/DashboardPage.tsx
import { Typography } from "@mui/material";
import { PageWrapper } from "../components/layout/PageWrapper";
import { tocMap } from "../routes/tocMap";
import type { TocItem } from "../types";

const tocItems: TocItem[] = tocMap["/dashboard"] || [];

export const DashboardPage = () => {
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumbItems={[{ label: "儀表板", path: "/dashboard" }]}
      content={<div>儀表板主內容區塊</div>}
      rightPanelContent={
        <div>
          <Typography variant="h6">儀表板右側內容</Typography>
          <p>這裡可以放圖表設定、說明、連結等。</p>
        </div>
      }
    />
  );
};
