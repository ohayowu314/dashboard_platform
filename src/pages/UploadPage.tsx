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
