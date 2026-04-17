// src/components/common/ActionButtons.tsx
import React from "react";
import { Button, Box } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelIcon from '@mui/icons-material/Cancel';


interface ConfirmCancelButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "contained" | "outlined" | "text";
  cancelVariant?: "contained" | "outlined" | "text";
  disabled?: boolean;
}

const ConfirmCancelButtons: React.FC<ConfirmCancelButtonsProps> = ({
  onConfirm,
  onCancel,
  showConfirm = true,
  confirmText = "確認",
  cancelText = "取消",
  confirmVariant = "contained",
  cancelVariant = "outlined",
  disabled = false,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant={cancelVariant}
        startIcon={<CancelIcon />}
        onClick={onCancel}
      // disabled={disabled}
      >
        {cancelText}
      </Button>
      {showConfirm && (
        <Button
          variant={confirmVariant}
          startIcon={<CheckCircleOutlineIcon />}
          onClick={onConfirm}
          disabled={disabled}
        >
          {confirmText}
        </Button>
      )}
    </Box>
  );
};

export default ConfirmCancelButtons;
