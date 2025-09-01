// src/pages/ChartConfigPage.tsx
import { PageWrapper } from "../components/layout/PageWrapper";
import { tocMap } from "../routes/tocMap";
import type { TocItem } from "../types";

const tocItems: TocItem[] = tocMap["/chart-config"] || [];

export const ChartConfigPage = () => {
  return (
    <PageWrapper
      tocItems={tocItems}
      breadcrumbItems={[{ label: "圖表設定", path: "/chart-config" }]}
      content={<div>ChartConfigPage</div>}
    />
  );
};
