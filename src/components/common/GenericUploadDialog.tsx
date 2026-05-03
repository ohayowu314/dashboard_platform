// src/components/common/GenericUploadDialog.tsx
import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { getNameFromFile } from "../../utils";
import { useDebounce } from "../../hooks/useDebounce";
import type { FileConflictAction } from "../../types";
import type { ConflictResult } from "shared/types/index";
import type { GenericUploadInputStatus } from "../../stores/uploadStore";

// ----------------------------------------------------
// 通用 Props 介面
// ----------------------------------------------------
interface Props<SelectedModeType extends string = string> {
  open: boolean;
  onClose: () => void;
  title: string;
  // 資源類型
  resourceType: "table" | "dashboard" | "chart";
  // 可接受的檔案類型 (e.g., "text/csv, application/json")
  fileAccept: string;
  // 單檔案/多檔案上傳模式
  isMultiFileUpload: boolean;
  // (New) 通知父組件需要檢查的名稱列表
  onNamesChange?: (names: string[]) => void;
  // (New) 由父組件傳入的衝突檢查結果
  conflictResults?: ConflictResult[];
  // (New) 是否正在檢查中
  isCheckingConflict?: boolean;
  // 處理單一檔案上傳完成並導航的邏輯 (例如：跳轉到編輯頁面)
  onSingleFileConfirmed: (file: File) => void;
  // 處理多檔案上傳 (例如：呼叫 Store 的 startUploads) 的邏輯
  onMultiFilesConfirmed: (filesStatus: GenericUploadInputStatus[]) => void;
  // (Optional) 針對特定資源的額外選項 UI (例如 DataTable 的 Mode 1/2)
  extraOptions?: {
    ui: React.ReactNode;
    fileFilter?: (file: File, selectedMode: SelectedModeType) => boolean;
    selectedMode: SelectedModeType;
  };
}

export const GenericUploadDialog = <SelectedModeType extends string = string>({
  open,
  onClose,
  title,
  resourceType: _resourceType,
  fileAccept,
  isMultiFileUpload,
  onNamesChange,
  conflictResults,
  isCheckingConflict = false,
  onSingleFileConfirmed,
  onMultiFilesConfirmed,
  extraOptions,
}: Props<SelectedModeType>) => {
  const [filesStatus, setFilesStatus] = useState<GenericUploadInputStatus[]>(
    []
  );
  const [isDragOver, setIsDragOver] = useState(false);
  // 使用 useDebounce 監聽 filesStatus 的變化，確保穩定後才觸發外部檢查
  const debouncedFilesStatus = useDebounce(filesStatus, 300);

  // 獲取目前已選擇的檔案 ID (即原始檔名)
  const existingFileIds = useMemo(
    () => new Set(filesStatus.map((f) => f.id)),
    [filesStatus]
  );

  // 當 debouncedFilesStatus 改變時，通知父組件
  useEffect(() => {
    if (onNamesChange) {
      const names = debouncedFilesStatus.map((f) => f.resourceName);
      onNamesChange(names);
    }
  }, [debouncedFilesStatus, onNamesChange]);

  // 狀態同步：在渲染期間根據傳入的 conflictResults 更新 filesStatus
  const [prevConflictResults, setPrevConflictResults] = useState<ConflictResult[] | undefined>(undefined);
  if (conflictResults !== prevConflictResults) {
    setPrevConflictResults(conflictResults);
    if (conflictResults && conflictResults.length === filesStatus.length) {
      setFilesStatus((prevStatus) =>
        prevStatus.map((status, i) => {
          const result = conflictResults[i];
          if (result && result.name === status.resourceName) {
            return { ...status, isConflict: result.isConflict };
          }
          return status;
        })
      );
    }
  }

  /** 預處理新的檔案列表，過濾無效檔案並建立 FileStatus 物件 */
  const preprocessFiles = (
    files: FileList | null
  ): GenericUploadInputStatus[] => {
    if (!files) return [];

    const fileArray = Array.from(files);

    // 檔案類型過濾
    const filterFn = extraOptions?.fileFilter
      ? (file: File) =>
        extraOptions.fileFilter!(file, extraOptions.selectedMode)
      : (file: File) => fileAccept.includes(file.type);

    return fileArray
      .filter(filterFn)
      .filter((file) => !existingFileIds.has(file.name)) // 避免名稱重複
      .slice(0, isMultiFileUpload ? undefined : 1)
      .map((file) => ({
        id: file.name, // 使用原始檔名作為 ID
        resourceName: getNameFromFile(file.name), // 提取純淨名稱
        file: file,
        isConflict: false, // 初始無衝突
        conflictAction: "rename" as FileConflictAction, // 預設操作
      }));
  };

  // --- 事件處理器 ---
  // 對話框取消
  const handleCancel = () => {
    setFilesStatus([]);
    onClose();
  };

  // 處理 input 輸入
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFilesStatus((prev) => [
        ...(isMultiFileUpload ? prev : []),
        ...preprocessFiles(event.target.files),
      ]);
    }
  };

  // 拖曳處理器
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer?.files) {
      setFilesStatus((prev) => [
        ...(isMultiFileUpload ? prev : []),
        ...preprocessFiles(event.dataTransfer.files),
      ]);
    }
  };

  // 處理移除檔案
  const handleRemoveFile = (fileId: string) => {
    setFilesStatus(filesStatus.filter((status) => status.id !== fileId));
  };

  // 處理檔名重複自訂操作設置 (使用 id 進行匹配)
  const handleActionChange = (
    fileId: string,
    conflictAction: GenericUploadInputStatus["conflictAction"]
  ) => {
    setFilesStatus(
      filesStatus.map((fileStatus) =>
        fileStatus.id === fileId
          ? { ...fileStatus, conflictAction }
          : fileStatus
      )
    );
  };

  // 處理確認上傳
  const handleUpload = () => {
    if (filesStatus.length === 0) return;

    onClose();
    if (filesStatus.length === 1 && !isMultiFileUpload) {
      onSingleFileConfirmed(filesStatus[0].file);
    } else {
      onMultiFilesConfirmed(filesStatus);
    }
    setFilesStatus([]);
  };

  // 確保 disabled 狀態基於 filesStatus
  const isConfirmDisabled = filesStatus.length === 0;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCancel}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {/* 額外選項 UI (例如 DataTable 的 Upload Mode Selection 1/2) */}
        {extraOptions && <Box sx={{ mb: 2 }} >{extraOptions.ui}</Box>}

        <Typography
          variant="subtitle1"
          sx={{ mt: extraOptions ? 0 : 2 }}
          gutterBottom
        >
          上傳檔案
        </Typography>
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed #ccc",
            borderColor: isDragOver ? "primary.main" : "#ccc",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: isDragOver ? "action.hover" : "#f9f9f9",
            transition: "all 0.3s ease-in-out",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={() => document.getElementById("file-upload-input")?.click()}
        >
          {isCheckingConflict && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
              }}
            />
          )}
          <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography>拖曳檔案到此處，或點擊上傳</Typography>
          <input
            id="file-upload-input"
            type="file"
            multiple={isMultiFileUpload}
            hidden
            onChange={handleFileChange}
            accept={fileAccept}
          />
        </Box>
        {/* ... (Files List UI and Conflict Handling) ... */}
        {filesStatus.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              已選擇檔案:
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {filesStatus.map((fileStatus) => (
                <li
                  key={fileStatus.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    marginBottom: "4px",
                  }}
                >
                  <Typography variant="body2" sx={{ flexGrow: 1, mr: 2 }}>
                    {fileStatus.id}
                  </Typography>
                  {fileStatus.isConflict ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                      <FormControl variant="standard" size="small">
                        <Select
                          value={fileStatus.conflictAction}
                          onChange={(e) =>
                            handleActionChange(
                              fileStatus.id,
                              e.target.value as FileConflictAction
                            )
                          }
                        >
                          <MenuItem value="rename">自動更名 (新檔案)</MenuItem>
                          <MenuItem value="replace">
                            更新替換 (覆蓋舊資料)
                          </MenuItem>
                          <MenuItem value="skip">忽略 (不處理)</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="caption">無衝突</Typography>
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(fileStatus.id)}
                    sx={{ p: 0.5, ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>取消</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={isConfirmDisabled}
        >
          {filesStatus.length === 1 && !isMultiFileUpload
            ? "確認上傳並編輯"
            : "確認"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
