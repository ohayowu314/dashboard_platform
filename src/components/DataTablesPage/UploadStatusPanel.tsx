// src/components/DataTablesPage/UploadStatusPanel.tsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
  LinearProgress,
  Paper,
  IconButton,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
  Snackbar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  useUploadStore,
  type FileUploadStatus,
} from "../../stores/uploadStore";

import { STANDARD_JSON_EXAMPLE } from "../../utils";

// --- 標準格式對話框元件 ---
interface StandardFormatDialogProps {
  open: boolean;
  onClose: () => void;
}

const StandardFormatDialog: React.FC<StandardFormatDialogProps> = ({
  open,
  onClose,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = useCallback(() => {
    // 複製標準 JSON 範例到剪貼簿
    navigator.clipboard.writeText(STANDARD_JSON_EXAMPLE).then(() => {
      setSnackbarOpen(true);
    });
  }, []);

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="standard-format-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="standard-format-dialog-title">
          標準 JSON 檔案格式範例
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom variant="subtitle1">
            請確保您的 JSON 檔案符合以下格式規範：
          </Typography>
          <List dense sx={{ ml: 2, mb: 2 }}>
            <ListItemText primary="- 必須是陣列（[ ]）" />
            <ListItemText primary="- 陣列元素並須是非陣列的物件（{ }）" />
            <ListItemText primary="- 所有物件（資料列）都應有相同的鍵（欄位名稱）" />
          </List>
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              overflowX: "auto",
              position: "relative",
            }}
          >
            <IconButton
              aria-label="copy"
              onClick={handleCopy}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "text.secondary",
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              <code>{STANDARD_JSON_EXAMPLE}</code>
            </pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="標準 JSON 格式已複製！"
      />
    </>
  );
};
// --- UploadStatusPanel 元件 ---

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
  const removeUpload = useUploadStore((state) => state.removeUpload);
  const toggleExpand = useUploadStore((state) => state.toggleExpand);

  // 控制對話框的開關狀態
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 阻止事件冒泡到 AccordionSummary
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (uploads.length === 0) {
    return (
      <Box sx={{ p: 2, color: "text.secondary" }}>上傳狀態會顯示在這裡。</Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* 標準格式範例對話框 */}
      <StandardFormatDialog open={isDialogOpen} onClose={handleCloseDialog} />
      <List dense sx={{ mt: 1 }}>
        {uploads.map((upload) => (
          <Paper key={upload.id} elevation={1} sx={{ mb: 1 }}>
            <Accordion
              expanded={upload.isExpanded}
              onChange={() => toggleExpand(upload.id)}
              sx={{
                "&.MuiAccordion-root": {
                  boxShadow: "none",
                  "&::before": { display: "none" },
                },
              }}
            >
              <AccordionSummary
                aria-controls={`panel-${upload.id}-content`}
                id={`panel-${upload.id}-header`}
                sx={{
                  minHeight: "48px",
                  "&.Mui-expanded": { minHeight: "48px" },
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                    margin: "12px 0",
                    "&.Mui-expanded": { margin: "12px 0" },
                  },
                }}
              >
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
                {(upload.status === "success" ||
                  upload.status === "failed") && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡到 AccordionSummary
                      removeUpload(upload.id);
                    }}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </AccordionSummary>
              <AccordionDetails>
                {upload.status === "uploading" && <LinearProgress />}
                {upload.status === "failed" && (
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
                    {upload.error && upload.errorName === "ValidationError" && (
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
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </List>
    </Box>
  );
};
