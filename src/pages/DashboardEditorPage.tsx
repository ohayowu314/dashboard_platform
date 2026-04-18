// src/pages/DashboardEditorPage.tsx (架構)
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { UploadNavigateState, CreateNavigateState } from "../types";
import { Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";
import { ActionButtonGroup } from "../components/common/ActionButtonGroup";

export const DashboardEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleCancelClick = () => {
    navigate(`/dashboards/view/${id}`);
  };
  const handleSaveClick = () => {
    navigate(`/dashboards/view/${id}`);
  };
  const handleViewClick = () => {
    navigate(`/dashboards/view/${id}`);
  };

  const location = useLocation();
  const state = location.state as
    | (UploadNavigateState | CreateNavigateState)
    | undefined;

  let initialContent = "從列表點擊編輯或上傳檔案後編輯";
  if (state?.editorMode === "create") {
    initialContent = "新的儀表板 (建立模式)";
  } else if (state?.editorMode === "upload" && state.file) {
    initialContent = `從檔案上傳的儀表板: ${state.file.name}`;
  }
  console.log(initialContent);

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: "編輯儀表板", path: "" },
      ]}
      content={
        <Box sx={{ p: 3 }}>
          <PageHeader
            headerLeftContent={<MainTitle title={`儀表板 #${id} 編輯模式`} />}
            headerRightContent={
              <ActionButtonGroup
                actions={[
                  {
                    key: "cancel",
                    label: "取消",
                    variant: "outlined",
                    startIcon: <CancelIcon />,
                    onClick: handleCancelClick,
                  },
                  {
                    key: "save",
                    label: "儲存",
                    variant: "outlined",
                    startIcon: <SaveIcon />,
                    onClick: handleSaveClick,
                  },
                  {
                    key: "confirm",
                    label: "確定",
                    variant: "contained",
                    startIcon: <CheckCircleOutlineIcon />,
                    onClick: handleViewClick,
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
