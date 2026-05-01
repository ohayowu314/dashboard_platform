// src/pages/DataTablesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "../components/layout/PageWrapper";
import { GenericListPage } from "../components/common/GenericListPage";
import { DataTableList } from "../components/DataTablesPage/DataTableList";
import { UploadDataTableDialog } from "../components/DataTablesPage/UploadDataTableDialog";
import { UploadStatusPanel } from "../components/DataTablesPage/UploadStatusPanel";
import { useUploadStore } from "../stores/uploadStore";
import { useAllTableInfos } from "../hooks/queries/dataTable";
import type { CreateNavigateState, PageConfig } from "../types";

export const DataTablesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { data: tableInfos = [], refetch: refreshTableInfos } = useAllTableInfos();
  const navigate = useNavigate();

  // 從 Zustand Store 獲取上傳狀態
  const uploads = useUploadStore((state) => state.uploads);
  const resetUploads = useUploadStore((state) => state.reset);

  // 監聽 uploads 狀態的變化，並在有成功上傳時刷新列表
  useEffect(() => {
    console.log("Uploads state changed:", uploads);
    if (uploads.some((u) => u.status === "success")) {
      console.log("Detected successful upload, refreshing table infos...");
      refreshTableInfos();
    }
  }, [uploads, refreshTableInfos]);

  useEffect(() => {
    // 頁面初次載入時清空上傳狀態，避免上次的紀錄影響本次
    return () => resetUploads();
  }, [resetUploads]);

  // 根據搜尋關鍵字過濾資料
  const filteredTables = tableInfos.filter((t) =>
    t.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNewTableClick = () => {
    const state: CreateNavigateState = { editorMode: "create" };
    navigate("/data-tables/edit", { state });
  };

  // 頁面配置
  const pageConfig: Omit<PageConfig, "tocItems"> = {
    breadcrumbItems: [{ label: "資料表格管理", path: "/data-tables" }],
    content: (
      <>
        <GenericListPage
          title="資料表格管理"
          items={filteredTables}
          searchable
          creatable
          uploadable
          searchPlaceholder="搜尋表格"
          onSearch={setSearchText}
          onCreate={() => handleNewTableClick()}
          onUpload={() => setUploadDialogOpen(true)}
          renderList={(items, viewMode) => (
            <DataTableList
              dataTables={items}
              viewMode={viewMode}
              refresh={refreshTableInfos}
            />
          )}
        />

        {/* 上傳資料表格對話框 */}
        <UploadDataTableDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
        />
      </>
    ),
    rightPanelContent: <UploadStatusPanel />, // 這裡使用新元件
    rightPanelTitle: "上傳狀態",
  };

  return <PageWrapper {...pageConfig} />;
};
