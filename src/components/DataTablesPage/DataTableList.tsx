// src/components/DataTablesPage/DataTableList.tsx
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import type { DataTableInfo, TableId } from "shared/types/dataTable";
import type { EditTableNavigateState } from "../../types";
import { GenericListView, type GenericItem } from "../common/GenericListView";
import { GenericItemActions } from "../common/GenericItemActions";

interface Props {
  dataTables: DataTableInfo[];
  // 新增 viewMode 屬性
  viewMode: "card" | "list";
  refresh: () => void;
}

export const DataTableList = ({ dataTables, viewMode, refresh }: Props) => {
  const navigate = useNavigate();

  const handleTableClick = (tableId: TableId) => {
    console.log(`點擊了表格 ${tableId}`);
    const state: EditTableNavigateState = {
      editorMode: "edit",
      tableId: tableId,
    };
    navigate("/data-tables/edit", {
      state,
    });
  };

  const handleAction = (action: string, id: TableId) => {
    console.log(`對表格 ${id} 執行操作: ${action}`);
    if (action === "delete") {
      window.api.deleteTable(id);
      refresh();
    }
  };

  // 將 DataTableInfo 轉換成 GenericItem
  const genericItems: GenericItem[] = dataTables.map((table) => ({
    id: table.id,
    title: table.name,
    updated_at: table.updated_at,
    metadata: {
      檔案大小: table.fileSize,
    },
  }));

  return (
    <Box>
      {dataTables.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          沒有找到符合條件的資料表格。
        </Typography>
      ) : (
        <GenericListView
          items={genericItems}
          viewMode={viewMode}
          onClickItem={(id) => handleTableClick(id)}
          renderActions={(id) => (
            <GenericItemActions
              itemId={id}
              actions={[
                { key: "update", label: "更新" },
                { key: "export", label: "匯出" },
                { key: "delete", label: "刪除" },
              ]}
              onAction={handleAction}
              confirmActions={["delete"]}
              confirmMessages={{
                delete: {
                  title: "刪除資料表",
                  content: "確定要刪除此資料表嗎？此操作無法復原。",
                },
              }}
            />
          )}
        />
      )}
    </Box>
  );
};
