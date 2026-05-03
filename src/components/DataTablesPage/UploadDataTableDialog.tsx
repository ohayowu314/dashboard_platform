// src/components/DataTablesPage/UploadDataTableDialog.tsx
import { useState, useMemo } from "react";
import { RadioGroup, Radio, FormControlLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenericUploadDialog } from "../common/GenericUploadDialog";
import {
  useUploadStore,
  type GenericUploadInputStatus,
  type UploadHandler,
} from "../../stores/uploadStore";
import { parseDataFile } from "../../utils";
import type { UploadNavigateState } from "../../types";
import type { DataTableInfo } from "shared/types/dataTable";
import { useTablesConflict } from "../../hooks/queries/dataTable";

interface Props { open: boolean; onClose: () => void; }

/**
 * 資料表格上傳處理函式。
 * 注意：因位於組件外部且用於 Zustand Store 的流程中，故直接調用 window.api（符合 GEMINI.md 規範例外）。
 */
const handleTableUpload: UploadHandler<DataTableInfo> = async (
  file,
  resourceName,
  uploadMode
) => {
  const parsedData = await parseDataFile(file); // 1. 解析檔案數據
  const tableInfo = { name: resourceName, description: "" };

  // 2. 呼叫後端 API 執行上傳
  const dataTableInfo = await window.api.uploadTable(
    tableInfo,
    parsedData,
    uploadMode
  );

  return dataTableInfo as DataTableInfo; // 類型斷言
};

export const UploadDataTableDialog = ({ open, onClose }: Props) => {
  const [uploadMode, setUploadMode] = useState<"mode1" | "mode2">("mode1");
  const navigate = useNavigate();
  const { startUploads } = useUploadStore();
  const [namesToCheck, setNamesToCheck] = useState<string[]>([]);

  // 使用宣告式 Hook 進行衝突檢查
  const { data: conflictResults, isLoading: isCheckingConflict } = useTablesConflict(namesToCheck);

  // 1. 處理單一檔案確認：導航到編輯頁面
  const handleSingleFileConfirmed = (file: File) => {
    console.log("單一檔案上傳，導航至上傳資料表格頁面...");
    const state: UploadNavigateState = {
      editorMode: "upload",
      file: file,
    };
    navigate("/data-tables/edit", { state });
  };

  // 2. 處理多檔案確認：呼叫 Store 的 action
  const handleMultiFilesConfirmed = (
    filesStatus: GenericUploadInputStatus[]
  ) => {
    console.log("多個檔案上傳，開始非同步上傳流程並返回列表頁...");
    startUploads(filesStatus, handleTableUpload);
  };

  // 4. Table 專屬的 Mode 選擇 UI 和過濾邏輯
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
      resourceType="table"
      fileAccept={
        uploadMode === "mode1"
          ? "text/csv, application/json"
          : "application/json"
      }
      isMultiFileUpload={true} // DataTable 支援多檔案上傳
      onNamesChange={setNamesToCheck}
      conflictResults={conflictResults}
      isCheckingConflict={isCheckingConflict}
      onSingleFileConfirmed={handleSingleFileConfirmed}
      onMultiFilesConfirmed={handleMultiFilesConfirmed}
      extraOptions={extraOptions}
    />
  );
};
