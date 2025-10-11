// src/components/DashboardsPage/UploadDashboardDialog.tsx
import { useState, useMemo } from "react";
import { RadioGroup, Radio, FormControlLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenericUploadDialog } from "../common/GenericUploadDialog";
import {
  useUploadStore,
  type GenericUploadInputStatus,
  type UploadHandler,
} from "../../stores/uploadStore";
import { parseDashboardFile } from "../../utils";
import type { UploadNavigateState } from "../../types";
import type { DashboardInfo } from "shared/types/dashboard";

interface Props {
  open: boolean;
  onClose: () => void;
}

// 實作 Dashboard 專屬的上傳處理函式 (傳入 Store)
const handleDashboardUpload: UploadHandler<DashboardInfo> = async (
  file,
  resourceName,
  uploadMode
) => {
  const parsedDashboard = await parseDashboardFile(file); // 1. 解析檔案數據
  const uploadInputInfo = { name: resourceName, description: "" };

  // 2. 呼叫後端 API 執行上傳
  const dashboardInfo = await window.api.uploadDashboard(
    uploadInputInfo,
    parsedDashboard,
    uploadMode
  );

  return dashboardInfo as DashboardInfo; // 類型斷言
};

export const UploadDashboardDialog = ({ open, onClose }: Props) => {
  const [uploadMode, setUploadMode] = useState<"mode1" | "mode2">("mode1");
  const navigate = useNavigate();
  const { startUploads } = useUploadStore();

  // 1. 處理單一檔案確認：導航到編輯頁面
  const handleSingleFileConfirmed = (file: File) => {
    console.log("單一檔案上傳，導航至上傳資料表格頁面...");
    const state: UploadNavigateState = {
      editorMode: "upload",
      file: file,
    };
    navigate("/dashboards/edit", { state });
  };

  // 2. 處理多檔案確認：呼叫 Store 的 action
  const handleMultiFilesConfirmed = (
    filesStatus: GenericUploadInputStatus[]
  ) => {
    console.log("多個檔案上傳，開始非同步上傳流程並返回列表頁...");
    startUploads(filesStatus, handleDashboardUpload);
  };

  // 3. Dashboard 專屬的衝突檢查 API 呼叫
  const checkConflictApi = (dashboardNames: string[]) => {
    return window.api.checkDashboardNamesConflict(dashboardNames);
  };

  // 4. Dashboard 專屬的 Mode 選擇 UI 和過濾邏輯
  const extraOptions = useMemo(
    () => ({
      ui: (
        <>
          <Typography variant="subtitle1" gutterBottom>
            上傳模式
          </Typography>
          <RadioGroup
            row
            value={uploadMode}
            onChange={(e) => setUploadMode(e.target.value as "mode1" | "mode2")}
          >
            <FormControlLabel
              value="mode1"
              control={<Radio />}
              label="模式一：僅上傳資料內容"
            />
            <FormControlLabel
              value="mode2"
              control={<Radio />}
              label="模式二：包含資訊與資料"
            />
          </RadioGroup>
        </>
      ),
      fileFilter: (file: File, selectedMode: "mode1" | "mode2") =>
        selectedMode === "mode1"
          ? file.type === "text/csv" || file.type === "application/json"
          : file.type === "application/json",
      selectedMode: uploadMode,
    }),
    [uploadMode]
  );

  return (
    <GenericUploadDialog
      open={open}
      onClose={onClose}
      title="上傳資料表格"
      resourceType="dashboard"
      fileAccept={
        uploadMode === "mode1"
          ? "text/csv, application/json"
          : "application/json"
      }
      isMultiFileUpload={true} // Dashboard 支援多檔案上傳
      checkConflict={checkConflictApi}
      onSingleFileConfirmed={handleSingleFileConfirmed}
      onMultiFilesConfirmed={handleMultiFilesConfirmed}
      extraOptions={extraOptions}
    />
  );
};
