// src/components/DataTablesPage/UploadDataTableDialog.tsx
import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Box,
  IconButton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { getNameFromFile } from "../../utils";
import { useUploadStore } from "../../stores/uploadStore";
import { useDebounce } from "../../hooks/useDebounce";
import type { FileConflictAction, UploadTableNavigateState } from "../../types";
import type { ConflictResult } from "shared/types/index";

interface FileStatus {
  /** 包含副檔名的原始檔名，作為唯一 ID (例如: 'users.csv') */
  id: string;
  /** 移除副檔名後的純淨表格名稱 (例如: 'users') */
  tableName: string;
  /** 原始檔案物件 */
  file: File;
  /** 是否與資料庫現有表格名稱衝突 */
  isConflict: boolean;
  /** 使用者的衝突解決方案選擇 */
  conflictAction: FileConflictAction;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UploadDataTableDialog = ({ open, onClose }: Props) => {
  const [uploadMode, setUploadMode] = useState<"mode1" | "mode2">("mode1");
  const [filesStatus, setFilesStatus] = useState<FileStatus[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const { startUploads } = useUploadStore();

  // 使用 useDebounce 監聽 filesStatus 的變化，確保穩定後才檢查
  // 由於 filesStatus 包含了 File 物件（非原始型別），所以當檔案被加入時，filesStatus 會是新的陣列
  const debouncedFilesStatus = useDebounce(filesStatus, 300);

  // --- 過濾邏輯 ---
  const fileTypeFilter = (file: File) =>
    uploadMode === "mode1"
      ? file.type === "text/csv" || file.type === "application/json"
      : file.type === "application/json";

  // 獲取目前已選擇的檔案 ID (即原始檔名)
  const existingFileIds = useMemo(
    () => new Set(filesStatus.map((f) => f.id)),
    [filesStatus]
  );

  /** 預處理新的檔案列表，過濾無效檔案並建立 FileStatus 物件 */
  const preprocessFiles = (files: FileList | null): FileStatus[] => {
    if (!files) {
      return [];
    }
    const fileArray = Array.from(files);

    return fileArray
      .filter(fileTypeFilter)
      .filter((file) => !existingFileIds.has(file.name)) // 避免名稱重複
      .map((file) => ({
        id: file.name, // 使用原始檔名作為 ID
        tableName: getNameFromFile(file.name), // 提取純淨名稱
        file: file,
        isConflict: false, // 初始無衝突
        conflictAction: "rename" as FileConflictAction, // 預設操作
      }));
  };

  // --- 事件處理器 ---
  // 對話框取消
  const handleCancel = () => {
    setFilesStatus([]); // 清空狀態
    onClose();
  };

  // 拖曳處理器
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer?.files) {
      setFilesStatus((prev) => [
        ...prev,
        ...preprocessFiles(event.dataTransfer.files),
      ]);
    }
  };

  // 處理 input 輸入
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFilesStatus((prev) => [
        ...prev,
        ...preprocessFiles(event.target.files),
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
    conflictAction: FileStatus["conflictAction"]
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

    if (filesStatus.length === 1) {
      console.log("單一檔案上傳，導航至上傳資料表格頁面...");
      onClose();
      const state: UploadTableNavigateState = {
        editorMode: "upload",
        file: filesStatus[0].file, // 使用 FileStatus 中的原始 File 物件
      };
      navigate("/data-tables/edit", { state });
    } else {
      console.log("多個檔案上傳，開始非同步上傳流程並返回列表頁...");
      // 呼叫 Zustand Store 的 action 來開始上傳
      startUploads(filesStatus);
      // 關閉對話框
      onClose();
      setFilesStatus([]);
    }
  };

  // --- 衝突檢查 useEffect 邏輯 ---

  useEffect(() => {
    // 檢查 debounce 後的狀態列表
    if (debouncedFilesStatus.length > 0) {
      // 提取用於後端 SQL 檢查的純淨名稱列表 (tableName)
      const tableNamesToCheck = debouncedFilesStatus.map((f) => f.tableName);

      // 呼叫後端 API 檢查衝突
      window.api
        .checkTablesConflict(tableNamesToCheck)
        .then((conflictResults: ConflictResult[]) => {
          // *** 檢查結果與輸入順序必須一致，這是基於後端實現的假設 ***
          if (conflictResults.length !== debouncedFilesStatus.length) {
            console.error("Conflict check result length mismatch!");
            return;
          }

          setFilesStatus((prevStatus) => {
            // 由於 debouncedFilesStatus 順序是穩定的，我們可以按索引進行更新
            return prevStatus.map((status, i) => {
              const conflictResult = conflictResults[i];

              // 再次檢查 name 確保順序沒亂（可選的安全檢查）
              if (conflictResult.name !== status.tableName) {
                console.error("Conflict check result name mismatch!");
                return status;
              }

              // 更新衝突狀態，保留使用者已做的 action 選擇
              return {
                ...status,
                isConflict: conflictResult.isConflict,
              };
            });
          });
        })
        .catch((error) => {
          console.error("Error checking table conflicts:", error);
          // 處理錯誤情況，例如顯示錯誤訊息
        });
    } else {
      setFilesStatus([]); // 清空
    }
  }, [debouncedFilesStatus]); // 監聽 Debounce 後的狀態

  // 確保 disabled 狀態基於 filesStatus
  const isConfirmDisabled = filesStatus.length === 0;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>上傳資料表格</DialogTitle>
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
        {/* ... Upload Mode Selection ... */}
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

        <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
          上傳檔案
        </Typography>
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
          }}
          onClick={() => document.getElementById("file-upload-input")?.click()}
        >
          <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography>拖曳檔案到此處，或點擊上傳</Typography>
          <input
            id="file-upload-input"
            type="file"
            multiple
            hidden
            onChange={handleFileChange}
            accept={
              uploadMode === "mode1"
                ? "text/csv, application/json"
                : "application/json"
            }
          />
        </Box>
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
                  <Typography variant="body2">{fileStatus.id}</Typography>{" "}
                  {/* 顯示包含副檔名的 ID */}
                  {fileStatus.isConflict ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <CheckCircleIcon color="success" /> // 無衝突
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(fileStatus.id)}
                    sx={{ p: 0.5 }}
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
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};
