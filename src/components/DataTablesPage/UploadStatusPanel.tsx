// src/components/DataTablesPage/UploadStatusPanel.tsx
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Paper,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import {
  useUploadStore,
  type FileUploadStatus,
} from "../../stores/uploadStore";

const getIcon = (status: FileUploadStatus["status"]) => {
  switch (status) {
    case "success":
      return <CheckCircleIcon color="success" sx={{ mr: 1 }} />;
    case "failed":
      return <ErrorIcon color="error" sx={{ mr: 1 }} />;
    case "uploading":
    default:
      return <CloudUploadIcon color="primary" sx={{ mr: 1 }} />;
  }
};

export const UploadStatusPanel: React.FC = () => {
  const uploads = useUploadStore((state) => state.uploads);
  const removeUpload = useUploadStore((state) => state.removeUpload); // 取得移除方法

  if (uploads.length === 0) {
    return <Box sx={{ p: 2 }}>這裡可以添加欄位類型、篩選、排序等控制項。</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <List dense sx={{ mt: 1 }}>
        {uploads.map((upload) => (
          <Paper key={upload.id} elevation={1} sx={{ mb: 1, p: 1 }}>
            <ListItem
              disablePadding
              secondaryAction={
                (upload.status === "success" || upload.status === "failed") && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeUpload(upload.id)}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                )
              }
            >
              {getIcon(upload.status)}
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
                        ? `上傳成功`
                        : `上傳失敗: ${upload.error}`}
                  </Typography>
                }
              />
            </ListItem>
            {upload.status === "uploading" && <LinearProgress />}
          </Paper>
        ))}
      </List>
    </Box>
  );
};
