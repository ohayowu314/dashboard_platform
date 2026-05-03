// src/components/DashboardsPage/UploadDashboardDialog.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericUploadDialog } from "../common/GenericUploadDialog";
import {
  useUploadStore,
  type GenericUploadInputStatus,
  type UploadHandler,
} from "../../stores/uploadStore";
import { parseDashboardFile } from "../../utils";
import type { UploadNavigateState } from "../../types";
import type { DashboardWithConfig } from "shared/types/dashboard";
import { useDashboardsConflict } from "../../hooks/queries/dashboard";

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * 儀表板上傳處理函式。
 * 注意：因位於組件外部且用於 Zustand Store 的非同步流程中，故直接調用 window.api（符合 GEMINI.md 規範例外）。
 */
const handleDashboardUpload: UploadHandler<DashboardWithConfig> = async (
  file,
  _resourceName,
  _uploadMode
) => {
  const parsedDashboard = await parseDashboardFile(file);
  const dashboardName = file.name.replace(/\.json$/, "");

  const result = await window.api.createDashboard(
    dashboardName,
    "",
    parsedDashboard
  );

  return result;
};

export const UploadDashboardDialog = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { startUploads } = useUploadStore();
  const [namesToCheck, setNamesToCheck] = useState<string[]>([]);

  // 使用宣告式 Hook 進行衝突檢查
  const { data: conflictResults, isLoading: isCheckingConflict } = useDashboardsConflict(namesToCheck);

  const handleSingleFileConfirmed = (file: File) => {
    console.log("單一檔案上傳，導航至上傳儀表板頁面...");
    const state: UploadNavigateState = {
      editorMode: "upload",
      file: file,
    };
    navigate("/dashboards/edit", { state });
  };

  const handleMultiFilesConfirmed = (
    filesStatus: GenericUploadInputStatus[]
  ) => {
    console.log("多個檔案上傳，開始非同步上傳流程並返回列表頁...");
    startUploads(filesStatus, handleDashboardUpload);
  };

  return (
    <GenericUploadDialog
      open={open}
      onClose={onClose}
      title="上傳儀表板"
      resourceType="dashboard"
      fileAccept="application/json"
      isMultiFileUpload={true}
      onNamesChange={setNamesToCheck}
      conflictResults={conflictResults}
      isCheckingConflict={isCheckingConflict}
      onSingleFileConfirmed={handleSingleFileConfirmed}
      onMultiFilesConfirmed={handleMultiFilesConfirmed}
    />
  );
};