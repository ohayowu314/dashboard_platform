// src/pages/DashboardViewPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { PageWrapper } from "../components/layout/PageWrapper";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";
import { ActionButtonGroup } from "../components/common/ActionButtonGroup";

export const DashboardViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/dashboards/edit/${id}`, {
      state: { editorMode: "edit" },
    });
  };

  const handleExportClick = () => {
    // Export logic placeholder
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
        </Box>
      }
    />
  );
};
