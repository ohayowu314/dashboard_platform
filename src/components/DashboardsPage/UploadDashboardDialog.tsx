// src/components/DashboardsPage/UploadDashboardDialog.tsx
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

interface Props {
  open: boolean;
  onClose: () => void;
}

const handleDashboardUpload: UploadHandler<DashboardWithConfig> = async (
  file,
  resourceName,
  uploadMode
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

  const checkConflictApi = (dashboardNames: string[]) => {
    return Promise.all(
      dashboardNames.map((name) =>
        window.api.checkDashboardConflict(name)
      )
    );
  };

  return (
    <GenericUploadDialog
      open={open}
      onClose={onClose}
      title="上傳儀表板"
      resourceType="dashboard"
      fileAccept="application/json"
      isMultiFileUpload={true}
      checkConflict={checkConflictApi}
      onSingleFileConfirmed={handleSingleFileConfirmed}
      onMultiFilesConfirmed={handleMultiFilesConfirmed}
    />
  );
};