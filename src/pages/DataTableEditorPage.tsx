// src/pages/DataTableEditorPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { PageWrapper } from "../components/layout/PageWrapper";
import EditableTitle from "../components/common/EditableTitle";
import ConfirmCancelButtons from "../components/common/ConfirmCancelButtons";
import DataTable from "../components/common/DataTable";
import PageHeader from "../components/common/PageHeader";
import { useTableEditor } from "../hooks/useTableEditor";
import { useTableDataInitializer } from "../hooks/useTableDataInitializer.tsx";
import type { EditorMode } from "src/types.tsx";
import type { TableId } from "shared/types/dataTable.ts";

export const DataTableEditorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editorMode: EditorMode = location.state?.editorMode || null;
  const tableId: TableId | undefined = location.state?.tableId;
  const file: File | null = location.state?.file || null;

  // 1. 使用新的 Hook 來統一處理資料初始化和載入狀態
  const { loading, error, initialState } = useTableDataInitializer(
    editorMode,
    tableId,
    file
  );

  // 2. 將初始資料傳遞給 useTableEditor
  const {
    tableName,
    setTableName,
    isEditingName,
    setIsEditingName,
    data,
    handleCellChange,
  } = useTableEditor(
    initialState?.data || null,
    initialState?.name || "未命名表格"
  );

  // 3. 將儲存邏輯獨立出來
  const handleConfirm = async () => {
    if (!data || !tableName.trim() || error) {
      alert("無法儲存，請檢查表格名稱和資料。");
      return;
    }
    try {
      if (initialState?.id) {
        console.log(`確認並更新表格: ${tableName}`);
        await window.api.updateTable(initialState.id, tableName, data);
        console.log("更新成功!");
      } else {
        console.log(`確認並儲存表格: ${tableName}`);
        const tableInfo = { name: tableName, description: "" };
        await window.api.uploadTable(tableInfo, data);
        console.log("儲存成功!");
      }
      navigate("/data-tables");
    } catch (e: unknown) {
      console.error("儲存失敗:", e);
      alert("儲存表格時發生錯誤。");
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
    <EditableTitle
      title={tableName}
      onTitleChange={setTableName}
      isEditing={isEditingName}
      onEditingChange={setIsEditingName}
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
    rightPanelContent: (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">編輯控制面板</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          這裡可以添加欄位類型、篩選、排序等控制項。
        </Typography>
      </Box>
    ),
  };

  return <PageWrapper {...pageConfig} />;
};
