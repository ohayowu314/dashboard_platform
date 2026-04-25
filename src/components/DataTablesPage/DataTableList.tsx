// src/components/DataTablesPage/DataTableList.tsx
import { useNavigate } from "react-router-dom";
import { GenericEntityList } from "../common/GenericEntityList";
import type { DataTableInfo } from "shared/types/dataTable";
import type { EditTableNavigateState } from "../../types";

interface Props {
  dataTables: DataTableInfo[];
  viewMode: "card" | "list";
  refresh: () => void;
}

export const DataTableList = ({ dataTables, viewMode, refresh }: Props) => {
  const navigate = useNavigate();

  return (
    <GenericEntityList<DataTableInfo>
      items={dataTables}
      viewMode={viewMode}
      getId={(t) => t.id}
      getTitle={(t) => t.name}
      getUpdatedAt={(t) => t.updated_at}
      getMetadata={(t) => ({ 檔案大小: String(t.fileSize ?? "未知") })}
      onClick={(t) => {
        const state: EditTableNavigateState = {
          editorMode: "edit",
          tableId: t.id,
        };
        navigate("/data-tables/edit", { state });
      }}
      onDelete={async (t) => {
        await window.api.deleteTable(t.id);
        refresh();
      }}
      deleteConfirmTitle="刪除資料表"
      deleteConfirmContent="確定要刪除此資料表嗎？此操作無法復原。"
      emptyMessage="沒有找到符合條件的資料表格。"
    />
  );
};
