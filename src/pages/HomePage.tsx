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
    />
  );
};
