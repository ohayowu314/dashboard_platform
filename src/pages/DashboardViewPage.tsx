// src/pages/DashboardViewPage.tsx (架構)
import { PageWrapper } from "../components/layout/PageWrapper";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export const DashboardViewPage = () => {
  const { id } = useParams<{ id: string }>(); // 取得 URL 中的儀表板 ID
  const navigate = useNavigate();

  const handleEditClick = () => {
    // 導航到編輯頁面，並帶入 tableId
    navigate("/dashboards/edit", {
      state: { editorMode: "edit", tableId: id },
    });
  };

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: `儀表板 #${id} 瀏覽`, path: "" },
      ]}
      content={
        <div style={{ padding: 20 }}>
          <h2>儀表板 #{id} 瀏覽模式</h2>
          <Button
            variant="contained"
            onClick={handleEditClick}
            style={{ position: "absolute", top: 15, right: 30 }}
          >
            編輯
          </Button>
          {/* 統計圖表展示區塊 (可互動) */}
          <div style={{ height: 800, border: "1px solid #ccc", marginTop: 20 }}>
            <p style={{ textAlign: "center", lineHeight: "800px" }}>
              圖表展示區塊 (可互動)
            </p>
          </div>
        </div>
      }
    />
  );
};
