// src/components/DataTablesPage/UploadStatusBar.tsx
import React from "react";
import {
  Box,
  Typography,
  ListItemText,
  LinearProgress,
  IconButton,
  ListItemIcon,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
  useUploadStore,
  type FileUploadStatus,
} from "../../stores/uploadStore";

import { ExpandableStatusBar } from "../common/ExpandableStatusBar";
import { getIcon } from "./uploadHelpers";
import { VALIDATION_ERROR } from "../../constants";

interface RemoveButtonProps {
  uploadId: string;
}

const RemoveUploadButton: React.FC<RemoveButtonProps> = ({ uploadId }) => {
  // 從 store 中獲取刪除動作
  const removeUpload = useUploadStore((state) => state.removeUpload);

  return (
    <IconButton
      edge="end"
      aria-label="delete"
      onClick={(e) => {
        e.stopPropagation(); // 關鍵：阻止事件冒泡
        removeUpload(uploadId);
      }}
      size="small"
      sx={{ ml: 1 }}
    >
      <CloseIcon />
    </IconButton>
  );
};

const UploadStatusDetail: React.FC<{
  upload: FileUploadStatus;
  handleOpenDialog: (e: React.MouseEvent) => void;
}> = ({ upload, handleOpenDialog }) => {
  if (upload.status === "uploading") {
    return <LinearProgress />;
  }

  if (upload.status === "failed") {
    return (
      <Box
        sx={{
          mt: 1,
          p: 1,
          backgroundColor: "rgba(255, 0, 0, 0.05)",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="error">
          錯誤原因: {upload.error}
        </Typography>
        {/* 檢查是否有 JSON 格式錯誤前綴，顯示連結 */}
        {upload.error && upload.errorName === VALIDATION_ERROR && (
          <Link
            component="button"
            variant="body2"
            onClick={handleOpenDialog}
            sx={{ mt: 1, display: "block" }}
          >
            檢視標準 JSON 格式範例
          </Link>
        )}
      </Box>
    );
  }
  return null; // 或其他成功/閒置狀態的內容
};

// --- UploadStatusBar 元件 ---

interface UploadStatusBarProps {
  fileuploadStatus: FileUploadStatus;
  handleOpenDialog: (e: React.MouseEvent) => void;
}

export const UploadStatusBar: React.FC<UploadStatusBarProps> = ({
  fileuploadStatus: upload,
  handleOpenDialog,
}) => {
  const toggleExpand = useUploadStore((state) => state.toggleExpand);

  return (
    <ExpandableStatusBar
      id={upload.id}
      isExpanded={upload.isExpanded}
      handleExpanded={() => toggleExpand(upload.id)}
      title={
        <>
          <ListItemIcon sx={{ minWidth: "40px" }}>
            {getIcon(upload.status)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                {upload.fileName}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                {upload.status === "uploading"
                  ? "上傳中..."
                  : upload.status === "success"
                    ? "上傳成功"
                    : "上傳失敗"}
              </Typography>
            }
          />
          {(upload.status === "success" || upload.status === "failed") && (
            <RemoveUploadButton uploadId={upload.id} />
          )}
        </>
      }
      detail={
        <UploadStatusDetail
          upload={upload}
          handleOpenDialog={handleOpenDialog}
        />
      }
    />
  );
};
