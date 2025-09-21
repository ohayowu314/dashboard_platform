// src/components/DataTablesPage/UploadStatusPanel.tsx
import React from "react";
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
  const removeUpload = useUploadStore((state) => state.removeUpload);
  const toggleExpand = useUploadStore((state) => state.toggleExpand);

  if (uploads.length === 0) {
    return (
      <Box sx={{ p: 2, color: "text.secondary" }}>上傳狀態會顯示在這裡。</Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
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
