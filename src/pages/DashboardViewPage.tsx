// src/pages/DashboardViewPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { PageWrapper } from "../components/layout/PageWrapper";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";
import { ActionButtonGroup } from "../components/common/ActionButtonGroup";
import { DashboardCanvas } from "../components/DashboardsPage/DashboardCanvas";
import type { DashboardWithConfig } from "shared/types/dashboard";

export const DashboardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardWithConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const numericId = Number(id);
        if (isNaN(numericId)) {
          setError("無效的儀表板 ID");
          setLoading(false);
          return;
        }
        const result = await window.api.getDashboard(numericId);
        setDashboard(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入失敗");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/dashboards/edit/${id}`, {
      state: { editorMode: "edit" },
    });
  };

  const handleExportClick = () => {
    // TODO: 實作匯出功能
    console.log("Export dashboard");
  };

  const handleViewChart = (chartId: number) => {
    navigate(`/charts/edit/${chartId}`, { state: { returnTo: `/dashboards/edit/${id}` } });
  };

  if (loading) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "儀表板管理", path: "/dashboards" },
          { label: "載入中...", path: "" },
        ]}
        content={
          <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  if (error || !dashboard) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "儀表板管理", path: "/dashboards" },
          { label: "錯誤", path: "" },
        ]}
        content={
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error || "無法載入儀表板"}</Alert>
          </Box>
        }
      />
    );
  }

  const { info, config } = dashboard;

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: "儀表板 " + info.name, path: "" },
      ]}
      content={
        <Box sx={{ p: 3 }}>
          <PageHeader
            headerLeftContent={
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <MainTitle title={info.name} />
                {info.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
                    {info.description}
                  </Typography>
                )}
              </Box>
            }
            headerRightContent={
              <ActionButtonGroup
                actions={[
                  {
                    key: "export",
                    label: "匯出",
                    variant: "outlined",
                    startIcon: <DownloadIcon />,
                    onClick: handleExportClick,
                  },
                  {
                    key: "edit",
                    label: "編輯",
                    variant: "contained",
                    startIcon: <ModeEditIcon />,
                    onClick: handleEditClick,
                  },
                ]}
              />
            }
          />
          <Box sx={{ mt: 2, minHeight: 500 }}>
            {config.blocks.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 400,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  color: "text.secondary",
                }}
              >
                <Typography>尚無區塊，點擊編輯按鈕新增</Typography>
              </Box>
            ) : (
              <DashboardCanvas
                config={config}
                isEditing={false}
                onViewChart={handleViewChart}
              />
            )}
          </Box>
        </Box>
      }
    />
  );
};

export default DashboardViewPage;