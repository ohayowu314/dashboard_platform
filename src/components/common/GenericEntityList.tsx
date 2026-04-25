// src/components/common/GenericEntityList.tsx
import { Box, Typography } from "@mui/material";
import { GenericListView, type GenericItem } from "./GenericListView";
import { GenericItemActions } from "./GenericItemActions";

export interface GenericEntityListProps<T> {
  items: T[];
  viewMode: "card" | "list";
  getId: (item: T) => string | number;
  getTitle: (item: T) => string;
  getUpdatedAt?: (item: T) => string;
  getMetadata?: (item: T) => Record<string, string>;
  onClick?: (item: T) => void;
  onDelete?: (item: T) => Promise<void>;
  onExport?: (item: T) => void;
  onUpdate?: (item: T) => void;
  actions?: { key: string; label: string }[];
  deleteConfirmTitle?: string;
  deleteConfirmContent?: string;
  emptyMessage?: string;
}

export function GenericEntityList<T>({
  items,
  viewMode,
  getId,
  getTitle,
  getUpdatedAt,
  getMetadata,
  onClick,
  onDelete,
  onExport,
  onUpdate,
  actions = [
    { key: "update", label: "更新" },
    { key: "export", label: "匯出" },
    { key: "delete", label: "刪除" },
  ],
  deleteConfirmTitle = "確認刪除",
  deleteConfirmContent = "確定要刪除嗎？此操作無法復原。",
  emptyMessage,
}: GenericEntityListProps<T>) {
  const genericItems: GenericItem<string | number>[] = items.map((item) => ({
    id: getId(item),
    title: getTitle(item),
    updated_at: getUpdatedAt?.(item),
    metadata: getMetadata?.(item),
  }));

  const handleClickItem = (id: string | number) => {
    const item = items.find((i) => getId(i) === id);
    if (item) {
      onClick?.(item);
    }
  };

  const handleAction = async (action: string, id: string | number) => {
    const item = items.find((i) => getId(i) === id);
    if (!item) return;

    switch (action) {
      case "delete":
        if (onDelete) {
          await onDelete(item);
        }
        break;
      case "export":
        onExport?.(item);
        break;
      case "update":
        onUpdate?.(item);
        break;
    }
  };

  const hasDeleteAction = actions.some((a) => a.key === "delete");

  return (
    <Box>
      {items.length === 0 && emptyMessage ? (
        <Typography variant="h6" color="text.secondary" align="center">
          {emptyMessage}
        </Typography>
      ) : (
        <GenericListView
          items={genericItems}
          viewMode={viewMode}
          onClickItem={handleClickItem}
          renderActions={(id) => (
            <GenericItemActions
              itemId={id}
              actions={actions}
              onAction={handleAction}
              confirmActions={hasDeleteAction ? ["delete"] : []}
              confirmMessages={
                hasDeleteAction
                  ? {
                      delete: {
                        title: deleteConfirmTitle,
                        content: deleteConfirmContent,
                      },
                    }
                  : undefined
              }
            />
          )}
        />
      )}
    </Box>
  );
}
