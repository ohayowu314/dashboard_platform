// src/components/common/ActionButtonGroup.tsx
import { Button, Box } from "@mui/material";

export interface ActionButton {
  key: string;
  label: string;
  variant?: "contained" | "outlined" | "text";
  startIcon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface ActionButtonGroupProps {
  actions: ActionButton[];
  spacing?: number;
}

export const ActionButtonGroup = ({
  actions,
  spacing = 1,
}: ActionButtonGroupProps) => {
  return (
    <Box sx={{ display: "flex", gap: spacing }}>
      {actions.map((action) => (
        <Button
          key={action.key}
          variant={action.variant || "outlined"}
          startIcon={action.startIcon}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </Box>
  );
};
