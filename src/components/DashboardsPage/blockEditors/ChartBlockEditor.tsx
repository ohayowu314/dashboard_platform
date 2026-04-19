import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Autocomplete,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { ChartBlockConfig } from "shared/types/dashboard";
import type { ChartInfo } from "shared/types/chart";

interface ChartBlockEditorProps {
  config: ChartBlockConfig;
  onSave: (config: ChartBlockConfig) => void;
  onCancel: () => void;
}

export const ChartBlockEditor = ({
  config,
  onSave,
  onCancel,
}: ChartBlockEditorProps) => {
  const [localConfig, setLocalConfig] = useState<ChartBlockConfig>(config);
  const [charts, setCharts] = useState<ChartInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const result = await window.api.getAllCharts();
        setCharts(result);
      } catch (e) {
        console.error("Failed to fetch charts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCharts();
  }, []);

  const handleSave = () => {
    onSave(localConfig);
  };

  const selectedChart = charts.find((c) => c.id === localConfig.chartId);

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {/* 標題列 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} >
          編輯圖表區塊
        </Typography>
        <Box>
          <IconButton size="small" onClick={onCancel} sx={{ mr: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          {/* 選擇圖表 */}
          <Autocomplete
            options={charts}
            getOptionLabel={(option) => option.name}
            value={selectedChart || null}
            onChange={(_, newValue) => {
              setLocalConfig((prev) => ({
                ...prev,
                chartId: newValue?.id || 0,
              }));
            }}
            renderInput={(params) => (
              <TextField {...params} label="選擇圖表" size="small" sx={{ mb: 2 }} />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  {option.description && (
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          />

          {/* 覆蓋標題 */}
          <TextField
            label="覆蓋標題 (可選)"
            fullWidth
            size="small"
            value={localConfig.title || ""}
            onChange={(e) =>
              setLocalConfig((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder={selectedChart?.name}
            sx={{ mb: 2 }}
          />

          {/* 顯示選項 */}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
            顯示選項
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={localConfig.options?.showLegend ?? true}
                onChange={(e) =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    options: { ...prev.options, showLegend: e.target.checked },
                  }))
                }
                size="small"
              />
            }
            label="顯示圖例"
            sx={{ mb: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localConfig.options?.showTooltip ?? true}
                onChange={(e) =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    options: { ...prev.options, showTooltip: e.target.checked },
                  }))
                }
                size="small"
              />
            }
            label="顯示提示"
            sx={{ mb: 1 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={localConfig.options?.animation ?? true}
                onChange={(e) =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    options: { ...prev.options, animation: e.target.checked },
                  }))
                }
                size="small"
              />
            }
            label="啟用動畫"
          />
        </>
      )}
    </Box>
  );
};

export default ChartBlockEditor;