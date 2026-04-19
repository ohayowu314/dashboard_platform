// src/pages/DashboardEditorPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { PageWrapper } from "../components/layout/PageWrapper";
import PageHeader from "../components/common/PageHeader";
import { MainTitle } from "../components/common/MainTitle";
import { ActionButtonGroup } from "../components/common/ActionButtonGroup";
import { DashboardCanvas } from "../components/DashboardsPage/DashboardCanvas";
import { BlockTypeSelector } from "../components/DashboardsPage/BlockTypeSelector";
import type { DashboardConfig, DashboardBlock, BlockType, BlockConfigMap, BaseBlock } from "shared/types/dashboard";

export const DashboardEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [dashboardId, setDashboardId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const isNew = id === "new";

  useEffect(() => {
    const initDashboard = async () => {
      if (isNew) {
        setConfig({
          title: "新儀表板",
          blocks: [],
          settings: { columns: 12, rowHeight: 50 },
        });
        setLoading(false);
      } else if (id) {
        try {
          const numericId = Number(id);
          if (isNaN(numericId)) {
            setError("無效的儀表板 ID");
            setLoading(false);
            return;
          }
          const dashboard = await window.api.getDashboard(numericId);
          setConfig(dashboard.config);
          setDashboardId(dashboard.info.id);
        } catch (e) {
          setError(e instanceof Error ? e.message : "載入失敗");
        }
        setLoading(false);
      }
    };
    initDashboard();
  }, [id, isNew]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      let result;
      if (dashboardId) {
        result = await window.api.updateDashboard(dashboardId, config.title, config.description, config);
      } else {
        result = await window.api.createDashboard(config.title, config.description, config);
        setDashboardId(result.info.id);
      }
      navigate(`/dashboards/view/${result.info.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const targetId = dashboardId || (isNew ? "1" : id);
    navigate(`/dashboards/view/${targetId}`);
  };

  const handleBlocksChange = (blocks: DashboardBlock[]) => {
    setConfig((prev) => (prev ? { ...prev, blocks } : null));
  };

  const handleDeleteBlock = (blockId: string) => {
    setConfig((prev) => {
      if (!prev) return null;
      return { ...prev, blocks: prev.blocks.filter((b) => b.id !== blockId) };
    });
  };

  const defaultConfigMap: {
    [K in BlockType]: () => BlockConfigMap[K];
  } = {
    text: () => ({
      title: "新文字區塊",
      titleStyle: { fontSize: 18, fontWeight: "bold", textAlign: "left", color: "#000000" },
      content: "",
      contentStyle: { fontSize: 14, fontWeight: "normal", textAlign: "left", color: "#333333" },
    }),
    chart: () => ({ chartId: 0 }),
    table: () => ({ dataTableId: 0 }),
  };

  const getDefaultBlockConfig = <T extends BlockType>(
    type: T
  ): BlockConfigMap[T] => {
    return defaultConfigMap[type]();
  };

  const createBlock = <T extends BlockType>(type: T): BaseBlock<T> => {
    return {
      id: `block-${Date.now()}`,
      type,
      layout: {
        x: 0,
        y: Infinity,
        w: type === "text" ? 6 : 4,
        h: type === "text" ? 2 : 3,
      },
      config: getDefaultBlockConfig(type),
    };
  }

  const handleAddBlock = <T extends BlockType>(type: T) => {
    const newBlock = createBlock(type) as DashboardBlock;
    setConfig((prev) => {
      if (!prev) return null;
      return { ...prev, blocks: [...prev.blocks, newBlock] };
    });
    setShowAddBlock(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setConfig((prev) => (prev ? { ...prev, title: newTitle } : null));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => (prev ? { ...prev, description: e.target.value } : null));
  };

  if (loading) {
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

  if (error && !config) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "儀表板管理", path: "/dashboards" },
          { label: "錯誤", path: "" },
        ]}
        content={
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
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
                    onClick: handleSave,
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
              onViewChart={(chartId) => navigate(`/charts/edit/${chartId}`, { state: { returnTo: `/dashboards/edit/${id}` } })}
              onAddBlock={() => setShowAddBlock(true)}
            />
          </Box>

          <BlockTypeSelector
            open={showAddBlock}
            onSelect={handleAddBlock}
            onClose={() => setShowAddBlock(false)}
          />
        </Box>
      }
    />
  );
};

export default DashboardEditorPage;