// src/components/DataTablesPage/StandardFormatDialog.tsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { STANDARD_JSON_EXAMPLE } from "../../utils";

interface StandardFormatDialogProps {
  open: boolean;
  onClose: () => void;
}

export const StandardFormatDialog: React.FC<StandardFormatDialogProps> = ({
  open,
  onClose,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(true);

  const handleCopy = useCallback(() => {
    // 複製標準 JSON 範例到剪貼簿
    navigator.clipboard
      .writeText(STANDARD_JSON_EXAMPLE)
      .then(() => {
        setCopySuccess(true);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        setCopySuccess(false);
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
        message={
          copySuccess
            ? "標準 JSON 格式已複製！"
            : "複製標準 JSON 格式失敗！請手動複製！"
        }
      />
    </>
  );
};
