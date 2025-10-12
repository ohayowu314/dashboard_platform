// src/pages/DashboardViewPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { PageWrapper } from "../components/layout/PageWrapper";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";

export const DashboardViewPage = () => {
  const { id } = useParams<{ id: string }>(); // 取得 URL 中的儀表板 ID
  const navigate = useNavigate();

  const handleEditClick = () => {
    // 導航到編輯頁面，並帶入 id
    navigate(`/dashboards/edit/${id}`, {
      state: { editorMode: "edit" },
    });
  };

  const handleExportClick = () => {
    // // 例如：導出儀表板設定 JSON
    // const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
    //   type: "application/json",
    // });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `dashboard-${id}.json`;
    // a.click();
    // URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: `儀表板 #${id} 瀏覽`, path: "" },
      ]}
      content={
        <Box sx={{ p: 3 }}>
          <PageHeader
            headerLeftContent={<MainTitle title={`儀表板 #${id} 瀏覽模式`} />}
            headerRightContent={
              <Box sx={{ display: "flex", gap: 1 }}>
                {/* 匯出按鈕 */}
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportClick}
                >
                  匯出
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ModeEditIcon />}
                  onClick={handleEditClick}
                >
                  編輯
                </Button>
              </Box>
            }
          />
        </Box>
      }
    />
  );
};
