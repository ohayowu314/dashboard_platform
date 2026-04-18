// src/pages/DataTableEditorPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import type { TableId } from "shared/types/dataTable.ts";
import type { EditorMode } from "../types.tsx";
import { PageWrapper } from "../components/layout/PageWrapper";
import { PageTitle } from "../components/common/PageTitle";
import ConfirmCancelButtons from "../components/common/ConfirmCancelButtons";
import DataTable from "../components/common/DataTable";
import PageHeader from "../components/common/PageHeader";
import { useTableEditor } from "../hooks/useTableEditor";
import { useTableDataInitializer } from "../hooks/useTableDataInitializer.tsx";
import { useToast } from "../hooks/useToast";

export const DataTableEditorPage: React.FC = () => {
  console.log("[DataTableEditorPage] renders");
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const editorMode: EditorMode = location.state?.editorMode || null;
  const tableId: TableId | undefined = location.state?.tableId;
  const file: File | null = location.state?.file || null;
  console.log("[DataTableEditorPage] editorMode:", editorMode, "tableId:", tableId, "file:", file?.name);

  // 1. 使用新的 Hook 來統一處理資料初始化和載入狀態
  console.log("[DataTableEditorPage] 呼叫 useTableDataInitializer 前");
  const { loading, error, initialState } = useTableDataInitializer(
    editorMode,
    tableId,
    file,
  );

  // 2. 將初始資料傳遞給 useTableEditor
  console.log("[DataTableEditorPage] 呼叫 useTableEditor 前, initialState:", !!initialState, "data:", !!initialState?.data, "name:", initialState?.name);
  const { tableName, setTableName, data, handleCellChange } = useTableEditor(
    initialState?.data || null,
    initialState?.name || "未命名表格",
  );

  // 3. 將儲存邏輯獨立出來
  const handleConfirm = async () => {
    if (!data || !tableName.trim() || error) {
      toast.error("無法儲存，請檢查表格名稱和資料。");
      return;
    }
    try {
      if (initialState?.id) {
        await window.api.updateTable(initialState.id, tableName, data);
        toast.success("更新成功!");
      } else {
        const tableInfo = { name: tableName, description: "" };
        await window.api.uploadTable(tableInfo, data, "create");
        toast.success("儲存成功!");
      }
      navigate("/data-tables");
    } catch (e: unknown) {
      toast.error("儲存表格時發生錯誤。");
    }
  };

  const handleCancel = () => {
    console.log("取消編輯");
    navigate("/data-tables");
  };

  const renderContent = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!data) return <Alert severity="info">無可編輯的表格資料。</Alert>;

    return <DataTable data={data} onCellChange={handleCellChange} />;
  };

  const renderHeaderLeftContent = () => (
    <PageTitle
      title={tableName}
      onTitleChange={setTableName}
      editable={true}
      label="表格名稱"
      placeholder="請輸入表格名稱"
    />
  );

  const pageConfig = {
    breadcrumbItems: [
      { label: "資料表格管理", path: "/data-tables" },
      { label: "編輯資料表格", path: "" },
    ],
    content: (
      <Box sx={{ p: 3 }}>
        <PageHeader
          headerLeftContent={renderHeaderLeftContent()}
          headerRightContent={
            <ConfirmCancelButtons
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              showConfirm={!error}
              disabled={loading || !!error || !data || !tableName.trim()}
            />
          }
        />
        {renderContent()}
      </Box>
    ),
    rightPanelTitle: "編輯控制面板",
    rightPanelContent: (
      <Box sx={{ p: 2 }}>這裡可以添加欄位類型、篩選、排序等控制項。</Box>
    ),
  };

  return <PageWrapper {...pageConfig} />;
};
