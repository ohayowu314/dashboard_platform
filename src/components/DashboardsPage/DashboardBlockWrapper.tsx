import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { DashboardBlock } from "shared/types/dashboard";

interface DashboardBlockWrapperProps {
  block: DashboardBlock;
  isEditing?: boolean;
  isBlockEditing?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

export const DashboardBlockWrapper = ({
  isEditing = false,
  isBlockEditing = false,
  onDelete,
  onEdit,
  children,
}: DashboardBlockWrapperProps) => {
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
        {isEditing && !isBlockEditing && (
          <Tooltip title="編輯">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
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

      <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>

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