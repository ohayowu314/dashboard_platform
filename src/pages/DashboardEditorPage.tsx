// src/pages/DashboardEditorPage.tsx (架構)
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { UploadNavigateState, CreateNavigateState } from "../types";
import { Box, Button } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";

export const DashboardEditorPage = () => {
  const { id } = useParams<{ id: string }>(); // 取得 URL 中的儀表板 ID
  const navigate = useNavigate();

  const handleCancelClick = () => {
    // 導航到編輯頁面，並帶入 id
    navigate(`/dashboards/view/${id}`);
  };
  const handleSaveClick = () => {
    // 導航到編輯頁面，並帶入 id
    navigate(`/dashboards/view/${id}`);
  };
  const handleViewClick = () => {
    // 導航到編輯頁面，並帶入 id
    navigate(`/dashboards/view/${id}`);
  };

  const location = useLocation();
  // 取得導航狀態，判斷是 'create' (點擊新增) 還是 'upload' (上傳後編輯)
  const state = location.state as
    | (UploadNavigateState | CreateNavigateState)
    | undefined;

  // 根據 state 決定初始內容
  let initialContent = "從列表點擊編輯或上傳檔案後編輯";
  if (state?.editorMode === "create") {
    initialContent = "新的儀表板 (建立模式)";
  } else if (state?.editorMode === "upload" && state.file) {
    initialContent = `從檔案上傳的儀表板: ${state.file.name}`;
    // 實際邏輯：讀取 state.file 內容並解析為儀表板結構
  }
  console.log(initialContent);

  // ... 編輯邏輯 (圖表拖拉、設定等)

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
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelClick}
                >
                  取消
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveClick}
                >
                  儲存
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CheckCircleOutlineIcon />}
                  onClick={handleViewClick}
                >
                  確定
                </Button>
              </Box>
            }
          />
        </Box>
      }
    />
  );
};
