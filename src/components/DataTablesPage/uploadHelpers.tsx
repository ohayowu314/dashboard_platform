// src/components/DataTablesPage/uploadHelpers.tsx
import type { FileUploadStatus } from "../../stores/uploadStore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const getIcon = (status: FileUploadStatus["status"]) => {
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
