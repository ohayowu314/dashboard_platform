// src/pages/DashboardsPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { GenericListPage } from "../components/common/GenericListPage";
import { DashboardList } from "../components/DashboardsPage/DashboardList";
import { UploadDashboardDialog } from "../components/DashboardsPage/UploadDashboardDialog";
import type { PageConfig } from "../../src/types";
import { useAllDashboards, useCreateDashboard } from "../hooks/queries/dashboard";

export const DashboardsPage = () => {
  const [searchText, setSearchText] = useState("");
  const { data: dashboardInfos = [], refetch } = useAllDashboards();
  const { mutateAsync: createDashboard } = useCreateDashboard();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewDashboardClick = async () => {
    const defaultName = `未命名儀表板_${Date.now()}`;
    const defaultConfig = {
      title: "新儀表板",
      blocks: [],
      settings: { columns: 12, rowHeight: 50 },
    };
    try {
      const result = await createDashboard({
        title: defaultName,
        description: "",
        config: defaultConfig,
      });
      navigate(`/dashboards/edit/${result.info.id}`, { state: { isNew: true } });
    } catch (e) {
      console.error("建立儀表板失敗", e);
    }
  };

  // 根據搜尋關鍵字過濾資料
  const filteredDashboards = dashboardInfos.filter((t) =>
    t.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 頁面配置
  const pageConfig: Omit<PageConfig, "tocItems"> = {
    breadcrumbItems: [{ label: "儀表板管理", path: "/dashboards" }],
    content: (
      <>
        <GenericListPage
          title="儀表板管理"
          items={filteredDashboards}
          searchable
          creatable
          uploadable
          searchPlaceholder="搜尋儀表板"
          onSearch={setSearchText}
          onCreate={handleNewDashboardClick}
          onUpload={() => setUploadDialogOpen(true)}
          renderList={(items, viewMode) => (
            <DashboardList
              dashboards={items}
              viewMode={viewMode}
              refresh={refetch}
            />
          )}
        />
        {/* 上傳儀表板對話框 */}
        <UploadDashboardDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
        />
      </>
    ),
    rightPanelContent: null,
    rightPanelTitle: "上傳狀態",
  };

  return <PageWrapper {...pageConfig} />;
};
