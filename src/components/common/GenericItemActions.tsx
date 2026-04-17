// src/components/common/GenericItemActions.tsx
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

export interface GenericItemAction<ActionType extends string = string> {
  key: ActionType;
  label: string;
}

export interface GenericItemActionsProps<
  T,
  ActionType extends string = string,
> {
  itemId: T;
  actions: GenericItemAction<ActionType>[]; // e.g. [{ key: "update", label: "更新" }]
  onAction: (action: ActionType, itemId: T) => void;

  /** 哪些行為需要確認對話框 */
  confirmActions?: ActionType[];

  /** 對話框標題與內容，可根據動作自訂 */
  confirmMessages?: Partial<
    Record<ActionType, { title: string; content: string }>
  >;

  /** menu/dialog 開關狀態變更 callback */
  onOpenChange?: (isOpen: boolean) => void;
}

export const GenericItemActions = <TId, ActionType extends string>({
  itemId,
  actions,
  onAction,
  confirmActions = [],
  confirmMessages = {},
  onOpenChange,
}: GenericItemActionsProps<TId, ActionType>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    onOpenChange?.(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    onOpenChange?.(false);
  };

  const handleActionClick = (action: ActionType) => {
    if (confirmActions.includes(action)) {
      setPendingAction(action);
    } else {
      onAction(action, itemId);
      handleMenuClose();
    }
  };

  const handleConfirm = () => {
    if (pendingAction) onAction(pendingAction, itemId);
    setPendingAction(null);
    handleMenuClose();
  };

  const handleCancel = () => {
    setPendingAction(null);
    handleMenuClose();
  };

  const currentConfirm = pendingAction
    ? (confirmMessages[pendingAction] ?? {
      title: "確認操作",
      content: "確定要執行這個操作嗎？此動作無法復原。",
    })
    : null;

  return (
    <>
      <IconButton onClick={handleMenuClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {actions.map(({ key, label }) => (
          <MenuItem key={key} onClick={() => handleActionClick(key)}>
            {label}
          </MenuItem>
        ))}
      </Menu>

      {currentConfirm && (
        <Dialog open onClose={handleCancel}>
          <DialogTitle>{currentConfirm.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{currentConfirm.content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={handleConfirm} color="error">
              確定
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
