// src/pages/DashboardEditorPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Alert, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { PageWrapper } from "../components/layout/PageWrapper";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";
import { ActionButtonGroup } from "../components/common/ActionButtonGroup";
import { DashboardCanvas } from "../components/DashboardsPage/DashboardCanvas";
import type { DashboardConfig, ChartBlockConfig } from "shared/types/dashboard";
import { 
  useDashboardDraft, 
  useSaveDashboardDraft, 
  useDeleteDashboardDraft, 
  useUpdateDashboard 
} from "../hooks/queries/dashboard";

const defaultChartConfig: ChartBlockConfig = {
  id: "",
  chartType: "bar",
  dataTableId: 0,
  xAxis: "",
  yAxis: "",
};

export const DashboardEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: dashboardDraft, isLoading, error: fetchError } = useDashboardDraft(numericId);
  const { mutateAsync: saveDraft } = useSaveDashboardDraft();
  const { mutateAsync: deleteDraft } = useDeleteDashboardDraft();
  const { mutateAsync: updateDashboard } = useUpdateDashboard();

  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const returnTo: string | null = (location.state?.returnTo || null);
  const isNew = !!location.state?.isNew;

  // 初始化 config：如果在渲染期間發現 config 為空且草稿已載入，則直接設定
  if (config === null && dashboardDraft) {
    setConfig(dashboardDraft.config);
  }

  // 當任何設定改變時，自動儲存到草稿
  useEffect(() => {
    if (config && numericId && !isLoading && !saving) {
      const timer = setTimeout(() => {
        saveDraft({ id: numericId, config });
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [config, numericId, isLoading, saving, saveDraft]);

  const handleSave = async () => {
    if (!config || !numericId) return;
    setSaving(true);
    try {
      await updateDashboard({ 
        id: numericId, 
        title: config.title, 
        description: config.description, 
        config 
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    if (!config || !numericId) return;
    setSaving(true);
    try {
      await updateDashboard({ 
        id: numericId, 
        title: config.title, 
        description: config.description, 
        config 
      });
      await deleteDraft(numericId);
      navigate(returnTo || `/dashboards/view/${numericId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "完成失敗");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (numericId) {
      await deleteDraft(numericId);
      navigate(returnTo || `/dashboards/view/${numericId}`);
    } else {
      navigate("/dashboards");
    }
  };

  const handleBlocksChange = (blocks: DashboardConfig["blocks"]) => {
    setConfig((prev) => (prev ? { ...prev, blocks } : null));
  };

  const handleDeleteBlock = (blockId: string) => {
    setConfig((prev) => {
      if (!prev) return null;
      return { ...prev, blocks: prev.blocks.filter((b) => b.id !== blockId) };
    });
  };

  const handleEditBlock = (blockId: string) => {
    navigate(`/dashboards/edit/${id}/blocks/${blockId}/edit`, {
      state: { returnTo: `/dashboards/edit/${id}` },
    });
  };

  const handleAddBlock = () => {
    const newId = `block-${Date.now()}`;
    const newBlock = {
      id: newId,
      layout: { x: 0, y: Infinity, w: 4, h: 3 },
      config: { ...defaultChartConfig, id: newId },
    };
    setConfig((prev) => {
      if (!prev) return null;
      return { ...prev, blocks: [...prev.blocks, newBlock] };
    });
  };

  const handleTitleChange = (newTitle: string) => {
    setConfig((prev) => (prev ? { ...prev, title: newTitle } : null));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => (prev ? { ...prev, description: e.target.value } : null));
  };

  if (isLoading) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "儀表板管理", path: "/dashboards" },
          { label: "載入中...", path: "" },
        ]}
        content={
          <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  const finalError = fetchError ? (fetchError instanceof Error ? fetchError.message : "載入失敗") : error;

  if (finalError && !config) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "儀表板管理", path: "/dashboards" },
          { label: "錯誤", path: "" },
        ]}
        content={
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{finalError}</Alert>
          </Box>
        }
      />
    );
  }

  if (!config) return null;

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板管理", path: "/dashboards" },
        { label: isNew ? "新增儀表板" : "編輯儀表板", path: "" },
      ]}
      content={
        <Box sx={{ p: 3 }}>
          <PageHeader
            headerLeftContent={
              <Box>
                <MainTitle
                  title={config.title}
                  editable
                  onTitleChange={handleTitleChange}
                />
                <TextField
                  variant="standard"
                  value={config.description || ""}
                  onChange={handleDescriptionChange}
                  size="small"
                  fullWidth
                  placeholder="新增描述..."
                  sx={{ mt: 1 }}
                />
              </Box>
            }
            headerRightContent={
              <ActionButtonGroup
                actions={[
                  {
                    key: "cancel",
                    label: "取消",
                    variant: "outlined",
                    startIcon: <CancelIcon />,
                    onClick: handleCancel,
                  },
                  {
                    key: "save",
                    label: "儲存",
                    variant: "outlined",
                    startIcon: <SaveIcon />,
                    onClick: handleSave,
                    disabled: saving,
                  },
                  {
                    key: "confirm",
                    label: "完成",
                    variant: "contained",
                    startIcon: <CheckCircleOutlineIcon />,
                    onClick: handleFinish,
                    disabled: saving,
                  },
                ]}
              />
            }
          />
          <Box sx={{ mt: 2, minHeight: 500 }}>
            <DashboardCanvas
              config={config}
              isEditing={true}
              onBlocksChange={handleBlocksChange}
              onDeleteBlock={handleDeleteBlock}
              onEditBlock={handleEditBlock}
              onAddBlock={handleAddBlock}
            />
          </Box>
        </Box>
      }
    />
  );
};

export default DashboardEditorPage;