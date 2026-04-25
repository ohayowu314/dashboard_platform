// src/components/DataTablesPage/UploadStatusPanel.tsx
import React, { useState } from "react";
import { Box, List } from "@mui/material";

import { useUploadStore } from "../../stores/uploadStore";

import { UploadStatusBar } from "./UploadStatusBar";
import { StandardFormatDialog } from "./StandardFormatDialog";

export const UploadStatusPanel: React.FC = () => {
  const uploads = useUploadStore((state) => state.uploads);

  // 控制[標準格式對話框]的開關狀態
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
          <UploadStatusBar
            fileuploadStatus={upload}
            handleOpenDialog={handleOpenDialog}
          />
        ))}
      </List>
    </Box>
  );
};
