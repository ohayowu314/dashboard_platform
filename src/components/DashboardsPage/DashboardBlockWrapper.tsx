import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { BlockType, BlockConfigMap, DashboardBlock } from "shared/types/dashboard";
import { TextBlockEditor } from "./blockEditors/TextBlockEditor";
import { ChartBlockEditor } from "./blockEditors/ChartBlockEditor";
import { TableBlockEditor } from "./blockEditors/TableBlockEditor";

interface DashboardBlockWrapperProps<T extends BlockType = BlockType> {
  block: DashboardBlock;
  isEditing?: boolean;
  isBlockEditing?: boolean;
  onDelete?: () => void;
  onViewChart?: () => void;
  onConfigChange?: (newConfig: BlockConfigMap[T]) => void;
  onEditingChange?: (isBlockEditing: boolean) => void;
  children: React.ReactNode;
}

export const DashboardBlockWrapper = ({
  block,
  isEditing = false,
  isBlockEditing = false,
  onDelete,
  onViewChart,
  onConfigChange,
  onEditingChange,
  children,
}: DashboardBlockWrapperProps) => {
  const [internalEditing, setInternalEditing] = useState(false);

  const isCurrentlyEditing = isBlockEditing || internalEditing;

  const handleEdit = () => {
    setInternalEditing(true);
    onEditingChange?.(true);
  };

  const handleBack = () => {
    setInternalEditing(false);
    onEditingChange?.(false);
  };


  const renderContent = () => {
    if (isCurrentlyEditing) {
      switch (block.type) {
        case "text":
          return (
            <TextBlockEditor
              config={block.config}
              onSave={(config) => {
                onConfigChange?.(config); // ✅ config = TextBlockConfig
                handleBack();
              }}
              onCancel={handleBack}
            />
          );

        case "chart":
          return (
            <ChartBlockEditor
              config={block.config}
              onSave={(config) => {
                onConfigChange?.(config); // ✅ ChartBlockConfig
                handleBack();
              }}
              onCancel={handleBack}
            />
          );

        case "table":
          return (
            <TableBlockEditor
              config={block.config}
              onSave={(config) => {
                onConfigChange?.(config); // ✅ TableBlockConfig
                handleBack();
              }}
              onCancel={handleBack}
            />
          );

        default:
          return null;
      }
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
      {isCurrentlyEditing && (
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

        {isEditing && !isCurrentlyEditing && (
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

        {isEditing && !isCurrentlyEditing && (
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

      {isEditing && !isCurrentlyEditing && (
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