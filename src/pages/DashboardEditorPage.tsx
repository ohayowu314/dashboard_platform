// src/pages/DashboardEditorPage.tsx (架構)
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { UploadNavigateState, CreateNavigateState } from "../types";
import { Button } from "@mui/material";

export const DashboardEditorPage = () => {
  const { id } = useParams<{ id: string }>(); // 取得 URL 中的儀表板 ID
  const navigate = useNavigate();

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

  // ... 編輯邏輯 (圖表拖拉、設定等)

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: "編輯儀表板", path: "" },
      ]}
      content={
        <div style={{ padding: 20 }}>
          <h2>儀表板編輯模式</h2>
          <Button
            variant="contained"
            onClick={handleViewClick}
            style={{ position: "absolute", top: 15, right: 30 }}
          >
            確定
          </Button>
          <p>內容來源: {initialContent}</p>
          {/* 統計圖表編輯區塊 */}
          <div
            style={{ height: 500, border: "1px dashed #ccc", marginTop: 20 }}
          >
            <p style={{ textAlign: "center", lineHeight: "500px" }}>
              圖表編輯區塊 (拖拉、新增、刪除)
            </p>
          </div>
        </div>
      }
    />
  );
};
