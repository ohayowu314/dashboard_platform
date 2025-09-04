// src/components/DataTablesPage/UploadDataTableDialog.tsx
import { useState } from "react";
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
  LinearProgress,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UploadDataTableDialog = ({ open, onClose }: Props) => {
  const [uploadMode, setUploadMode] = useState<"mode1" | "mode2">("mode1");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate(); // 使用 Hook

  const handleCancel = () => {
    if (!uploading) {
      setSelectedFiles([]);
      onClose();
    }
  };

  const fileTypeFilter = (file: File) =>
    uploadMode === "mode1"
      ? file.type === "text/csv" || file.type === "application/json"
      : file.type === "application/json";

  const fileNameRepeatFilter = (file: File) => {
    const existingFileNames = selectedFiles.map((f) => f.name);
    return !existingFileNames.includes(file.name);
  };

  const preprocessFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    return fileArray.filter(fileTypeFilter).filter(fileNameRepeatFilter);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles([
        ...selectedFiles,
        ...preprocessFiles(event.target.files),
      ]);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    console.log(`正在以模式 ${uploadMode} 上傳以下檔案:`, selectedFiles);

    setTimeout(() => {
      setUploading(false);
      onClose();
      if (selectedFiles.length === 1) {
        console.log("單一檔案上傳，導航至上傳資料表格頁面...");
        // 使用 navigate 傳遞 state
        navigate("/data-tables/edit", { state: { file: selectedFiles[0] } });
      } else {
        console.log("多個檔案上傳，返回資料表格列表頁...");
        setSelectedFiles([]);
      }
    }, 2000);
  };

  // 拖曳事件處理器
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
      setSelectedFiles([
        ...selectedFiles,
        ...preprocessFiles(event.dataTransfer.files),
      ]);
    }
  };

  // 處理移除檔案
  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>上傳資料表格</DialogTitle>
      <DialogContent dividers>
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
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              已選擇檔案:
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {selectedFiles.map((file) => (
                <li
                  key={file.name}
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
                  <Typography variant="body2">{file.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(file.name)}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Box>
        )}
        {uploading && <LinearProgress sx={{ mt: 2 }} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={uploading}>
          取消
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={selectedFiles.length === 0 || uploading}
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};
