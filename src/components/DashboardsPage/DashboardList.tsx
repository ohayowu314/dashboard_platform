// src/components/DashboardsPage/DashboardList.tsx
import { useNavigate } from "react-router-dom";
import { GenericEntityList } from "../common/GenericEntityList";
import type { DashboardInfo } from "shared/types/dashboard";
import { useSetSystemConfig, SYSTEM_CONFIG_KEYS } from "../../hooks/queries/systemConfig";
import { useToast } from "../../hooks/useToast";

interface Props {
  dashboards: DashboardInfo[];
  viewMode: "card" | "list";
  refresh: () => void;
}

export const DashboardList = ({ dashboards, viewMode, refresh }: Props) => {
  const navigate = useNavigate();
  const { mutate: setConfig } = useSetSystemConfig();
  const { success } = useToast();

  const handleCustomAction = (action: string, dashboard: DashboardInfo) => {
    if (action === "set-default") {
      setConfig({
        key: SYSTEM_CONFIG_KEYS.DEFAULT_DASHBOARD_ID,
        value: dashboard.id.toString(),
      });
      success(`已將 "${dashboard.name}" 設為預設儀表板`);
    }
  };

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
      onCustomAction={handleCustomAction}
      actions={[
        { key: "set-default", label: "設為預設" },
        { key: "update", label: "更新" },
        { key: "delete", label: "刪除" },
      ]}
      deleteConfirmTitle="刪除儀表板"
      deleteConfirmContent="確定要刪除這個儀表板嗎？此操作無法復原。"
    />
  );
};
