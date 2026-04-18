// src/components/common/PageTitle.tsx
import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

export interface PageTitleProps {
  title: string;
  editable?: boolean;
  onTitleChange?: (newTitle: string) => void;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  label?: string;
  placeholder?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  title,
  editable = false,
  onTitleChange,
  variant = "h4",
  label,
  placeholder = "請輸入標題",
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = useCallback(() => {
    if (editable) setIsEditing(true);
  }, [editable]);

  const handleStopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        handleStopEditing();
      }
    },
    [handleStopEditing],
  );

  if (!isEditing) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {label && <Typography variant={variant} sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>}
        {editable ? (
          <Tooltip title={`點擊編輯${label}`}>
            <Box
              onClick={handleStartEditing}
              onKeyDown={handleKeyDown}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  "& .MuiTypography-root": {
                    color: "primary.main",
                    textDecoration: "underline",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "primary.main",
                  },
                },
              }}
              tabIndex={0}
              role="button"
            >
              <Typography
                variant={variant}
                component="span"
                sx={{ fontWeight: "bold", ml: 1 }}
              >
                {title}
              </Typography>
              <IconButton size="small" sx={{ ml: 0.5 }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Tooltip>
        ) : (
          <Typography variant={variant} sx={{ fontWeight: "bold", ml: 1 }}>
            {title}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography variant={variant} sx={{ mr: 1, fontWeight: "bold" }}>
        {label}
      </Typography>
      <TextField
        value={title}
        onChange={(e) => onTitleChange?.(e.target.value)}
        onBlur={handleStopEditing}
        onKeyDown={handleKeyDown}
        autoFocus
        variant="standard"
        placeholder={placeholder}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};
