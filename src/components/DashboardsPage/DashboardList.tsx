// src/components/DashboardsPage/DashboardList.tsx
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { GenericListView, type GenericItem } from "../common/GenericListView";
import { GenericItemActions } from "../common/GenericItemActions";
import type { DashboardInfo } from "shared/types/dashboard";

interface Props {
  dashboards: DashboardInfo[];
  viewMode: "card" | "list";
  refresh: () => void;
}

export const DashboardList = ({ dashboards, viewMode, refresh }: Props) => {
  const navigate = useNavigate();

  // 點擊項目名稱時導向展示頁
  const handleClickItem = (id: DashboardInfo["id"]) => {
    navigate(`/dashboards/view/${id}`);
  };

  // 執行操作（更新、刪除等）
  const handleAction = (action: string, id: DashboardInfo["id"]) => {
    console.log(`對儀表板 ${id} 執行操作: ${action}`);
    if (action === "刪除") {
      //   window.api.deleteDashboard(id);
      refresh();
    }
    // 其他操作邏輯可擴充
  };

  // 將 DashboardInfo 轉換成 GenericItem
  const genericItems: GenericItem<DashboardInfo["id"]>[] = dashboards.map(
    (d) => ({
      id: d.id,
      title: d.name,
      subtitle: `更新時間：${d.updated_at}`,
      metadata: {
        圖表數量: d.chartCount.toString(),
      },
    })
  );

  return (
    <Box>
      <GenericListView
        items={genericItems}
        viewMode={viewMode}
        onClickItem={handleClickItem}
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
                title: "刪除儀表板",
                content: "確定要刪除這個儀表板嗎？此操作無法復原。",
              },
            }}
          />
        )}
      />
    </Box>
  );
};
