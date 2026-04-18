import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { DashboardBlock } from "shared/types/dashboard";

interface DashboardBlockWrapperProps {
  block: DashboardBlock;
  isEditing?: boolean;
  onDelete?: () => void;
  onViewChart?: () => void;
  children: React.ReactNode;
}

export const DashboardBlockWrapper = ({
  block,
  isEditing = false,
  onDelete,
  onViewChart,
  children,
}: DashboardBlockWrapperProps) => {
  const [isBlockEditing, setIsBlockEditing] = useState(false);

  const handleEdit = () => {
    setIsBlockEditing(!isBlockEditing);
  };

  const handleBack = () => {
    setIsBlockEditing(false);
  };

  const renderContent = () => {
    if (isBlockEditing) {
      return (
        <Box
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          區塊編輯表單 (待實作)
        </Box>
      );
    }
    return children;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        "&:hover .block-icons": {
          opacity: 1,
        },
      }}
    >
      {isBlockEditing && (
        <IconButton
          onClick={handleBack}
          sx={{
            position: "absolute",
            top: 4,
            left: 4,
            zIndex: 10,
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        className="block-icons"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          zIndex: 10,
          display: "flex",
          gap: 0.5,
          opacity: 0,
          transition: "opacity 0.2s",
        }}
      >
        {block.type === "chart" && onViewChart && (
          <Tooltip title="查看圖表">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onViewChart();
              }}
              sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {isEditing && !isBlockEditing && (
          <Tooltip title="編輯">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {isEditing && !isBlockEditing && (
          <Tooltip title="刪除">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              sx={{ backgroundColor: "rgba(255,255,255,0.8)" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ width: "100%", height: "100%" }}>{renderContent()}</Box>

      {isEditing && !isBlockEditing && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            border: "2px dashed transparent",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
};

export default DashboardBlockWrapper;