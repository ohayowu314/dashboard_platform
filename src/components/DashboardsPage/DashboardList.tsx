// src/components/DashboardsPage/DashboardList.tsx
import { useNavigate } from "react-router-dom";
import { GenericEntityList } from "../common/GenericEntityList";
import type { DashboardInfo } from "shared/types/dashboard";

interface Props {
  dashboards: DashboardInfo[];
  viewMode: "card" | "list";
  refresh: () => void;
}

export const DashboardList = ({ dashboards, viewMode, refresh }: Props) => {
  const navigate = useNavigate();

  return (
    <GenericEntityList<DashboardInfo>
      items={dashboards}
      viewMode={viewMode}
      getId={(d) => d.id}
      getTitle={(d) => d.name}
      getUpdatedAt={(d) => d.updated_at}
      getMetadata={(d) => ({ 描述: d.description || "-" })}
      onClick={(d) => navigate(`/dashboards/view/${d.id}`)}
      onDelete={async (d) => {
        await window.api.deleteDashboard(d.id);
        refresh();
      }}
      deleteConfirmTitle="刪除儀表板"
      deleteConfirmContent="確定要刪除這個儀表板嗎？此操作無法復原。"
    />
  );
};
