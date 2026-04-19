// src/pages/ChartEditorPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PageWrapper } from "../components/layout/PageWrapper";
import type { ChartConfig, ChartType } from "shared/types/chart";
import { useChart, useCreateChart, useUpdateChart } from "../hooks/queries/chart";
import { useAllTableInfos, useTable } from "../hooks/queries/dataTable";

const CHART_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "bar", label: "柱狀圖" },
  { value: "line", label: "折線圖" },
  { value: "area", label: "區域圖" },
  { value: "pie", label: "圓餅圖" },
  { value: "scatter", label: "散點圖" },
  { value: "histogram", label: "直方圖" },
];

const defaultChartConfig: ChartConfig = {
  title: "",
  type: "bar",
  xAxis: "",
  yAxis: "",
  options: {
    showLegend: true,
    showTooltip: true,
    animation: true,
  },
};

const getChartComponent = (
  type: ChartType,
  data: Record<string, unknown>[],
  config: ChartConfig
) => {
  const { xAxis, yAxis, options } = config;
  const showLegend = options?.showLegend ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const animation = options?.animation ?? true;

  const xKey = xAxis;
  const yKeys = Array.isArray(yAxis) ? yAxis : [yAxis];

  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "text.secondary",
        }}
      >
        <Typography>暫無資料</Typography>
      </Box>
    );
  }

  const commonProps = {
    data,
    margin: { top: 10, right: 30, left: 0, bottom: 5 },
  };

  const axisProps = {
    XAxis: <XAxis dataKey={xKey} />,
    YAxis: <YAxis />,
    CartesianGrid: <CartesianGrid strokeDasharray="3 3" />,
  };

  const renderTooltip = showTooltip ? <Tooltip /> : null;
  const renderLegend = showLegend ? <Legend /> : null;

  switch (type) {
    case "bar":
      return (
        <BarChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {yKeys.map((key, index) => (
            <Bar
              key={key as string}
              dataKey={key as string}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              isAnimationActive={animation}
            />
          ))}
        </BarChart>
      );

    case "line":
      return (
        <LineChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {yKeys.map((key, index) => (
            <Line
              key={key as string}
              type="monotone"
              dataKey={key as string}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              isAnimationActive={animation}
            />
          ))}
        </LineChart>
      );

    case "area":
      return (
        <AreaChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {yKeys.map((key, index) => (
            <Area
              key={key as string}
              type="monotone"
              dataKey={key as string}
              stroke={CHART_COLORS[index % CHART_COLORS.length]}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              isAnimationActive={animation}
            />
          ))}
        </AreaChart>
      );

    case "pie": {
      const pieData = data.map((item) => ({
        name: item[xKey],
        value: item[yKeys[0] as string],
      }));
      return (
        <PieChart>
          {renderTooltip}
          {renderLegend}
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            isAnimationActive={animation}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      );
    }

    case "scatter": {
      return (
        <ScatterChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          <Scatter
            name={yKeys[0] as string}
            data={data}
            fill={CHART_COLORS[0]}
            isAnimationActive={animation}
          />
        </ScatterChart>
      );
    }

    case "histogram":
      return (
        <BarChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          <Bar
            dataKey={yKeys[0] as string}
            fill={CHART_COLORS[0]}
            isAnimationActive={animation}
          />
        </BarChart>
      );

    default:
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "text.secondary",
          }}
        >
          <Typography>不支援的圖表類型: {type}</Typography>
        </Box>
      );
  }
};

export const ChartEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isNew = id === "new";
  const returnTo = (location.state as { returnTo?: string })?.returnTo || "/charts";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dataTableId, setDataTableId] = useState<number | null>(null);
  const [config, setConfig] = useState<ChartConfig>(defaultChartConfig);

  const { data: currentChart, isLoading: loadingCurrentChart } = useChart(
    isNew ? 0 : Number(id)
  );

  const { data: tables, isLoading: loadingTables } = useAllTableInfos();
  const { data: tableData, isLoading: loadingTableData } = useTable(
    dataTableId || 0
  );

  const createChartMutation = useCreateChart();
  const updateChartMutation = useUpdateChart();

  useEffect(() => {
    if (!isNew && currentChart) {
      setName(currentChart.info.name);
      setDescription(currentChart.info.description || "");
      setDataTableId(currentChart.info.dataTableId || null);
      setConfig(currentChart.config);
    }
  }, [currentChart, isNew]);

  const headers = tableData?.data.headers || [];
  const tableRows = tableData?.data.rows || [];

  const chartData = useMemo(() => {
    if (!tableRows.length || !config.xAxis || !config.yAxis) return [];
    return tableRows.map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
  }, [tableRows, headers, config.xAxis, config.yAxis]);

  const handleSave = async () => {
    if (!name.trim()) return;

    const chartInfo = {
      name: name.trim(),
      description: description.trim() || undefined,
      dataTableId: dataTableId || undefined,
    };

    try {
      if (isNew) {
        await createChartMutation.mutateAsync({
          chartInfo,
          config,
        });
        navigate(returnTo, { replace: true });
      } else {
        await updateChartMutation.mutateAsync({
          id: Number(id),
          chartInfo,
          config,
        });
        navigate(returnTo, { replace: true });
      }
    } catch (e) {
      console.error("Failed to save chart:", e);
    }
  };

  const handleCancel = () => {
    navigate(returnTo, { replace: true });
  };

  const handleBack = () => {
    navigate(returnTo, { replace: true });
  };

  const selectedTable = tables?.find((t) => t.id === dataTableId);

  const isLoading = (isNew ? loadingTables : loadingCurrentChart) || loadingTableData;

  if (isLoading) {
    return (
      <PageWrapper
        breadcrumbItems={[
          { label: "圖表管理", path: "/charts" },
          { label: isNew ? "新增圖表" : "編輯圖表", path: "" },
        ]}
        content={
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        }
      />
    );
  }

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "圖表管理", path: "/charts" },
        { label: isNew ? "新增圖表" : "編輯圖表", path: "" },
      ]}
      content={
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* 標題列 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 1 }}>
                {isNew ? "新增圖表" : "編輯圖表"}
              </Typography>
              {!isNew && id && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (ID: {id})
                </Typography>
              )}
            </Box>
            <Box>
              <Button
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                取消
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!name.trim() || createChartMutation.isPending || updateChartMutation.isPending}
              >
                儲存
              </Button>
            </Box>
          </Box>

          {/* 三欄佈局 */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* 左側：資料表選擇 + 欄位選擇 */}
            <Box
              sx={{
                width: 280,
                borderRight: 1,
                borderColor: "divider",
                p: 2,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* 資料表選擇 */}
              <Autocomplete
                options={tables || []}
                getOptionLabel={(option) => option.name}
                value={selectedTable || null}
                onChange={(_, newValue) => {
                  setDataTableId(newValue?.id || null);
                  setConfig((prev) => ({ ...prev, xAxis: "", yAxis: "" }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="選擇資料表" size="small" />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Typography variant="body2">{option.name}</Typography>
                  </Box>
                )}
              />

              {/* X軸選擇 */}
              <Autocomplete
                options={headers}
                getOptionLabel={(option) => option}
                value={config.xAxis || null}
                onChange={(_, newValue) => {
                  setConfig((prev) => ({ ...prev, xAxis: newValue || "" }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="X 軸欄位" size="small" />
                )}
                disabled={!dataTableId}
              />

              {/* Y軸選択 */}
              <Autocomplete
                multiple
                options={headers}
                getOptionLabel={(option) => option}
                value={Array.isArray(config.yAxis) ? config.yAxis : config.yAxis ? [config.yAxis] : []}
                onChange={(_, newValue) => {
                  setConfig((prev) => ({ ...prev, yAxis: newValue }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Y 軸欄位" size="small" />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Typography variant="body2">{option}</Typography>
                  </Box>
                )}
                disabled={!dataTableId}
              />
            </Box>

            {/* 中間：圖表預覽 */}
            <Box sx={{ flex: 1, p: 2, overflow: "hidden" }}>
              {(!config.xAxis || !config.yAxis) ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "text.secondary",
                  }}
                >
                  <Typography>請選擇 X 軸和 Y 軸欄位</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {getChartComponent(config.type, chartData, config)}
                </ResponsiveContainer>
              )}
            </Box>

            {/* 右側：圖表名稱 + 類型 + 選項 */}
            <Box
              sx={{
                width: 280,
                borderLeft: 1,
                borderColor: "divider",
                p: 2,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* 圖表名稱 */}
              <TextField
                label="圖表名稱"
                fullWidth
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* 描述 */}
              <TextField
                label="描述"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
                圖表類型
              </Typography>
              <ToggleButtonGroup
                value={config.type}
                exclusive
                onChange={(_, value) =>
                  value && setConfig((prev) => ({ ...prev, type: value }))
                }
                size="small"
              >
                {CHART_TYPES.map((ct) => (
                  <ToggleButton key={ct.value} value={ct.value}>
                    {ct.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1 }}>
                顯示選項
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.options?.showLegend ?? true}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        options: { ...prev.options, showLegend: e.target.checked },
                      }))
                    }
                    size="small"
                  />
                }
                label="顯示圖例"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.options?.showTooltip ?? true}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        options: { ...prev.options, showTooltip: e.target.checked },
                      }))
                    }
                    size="small"
                  />
                }
                label="顯示提示"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={config.options?.animation ?? true}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        options: { ...prev.options, animation: e.target.checked },
                      }))
                    }
                    size="small"
                  />
                }
                label="啟用動畫"
              />
            </Box>
          </Box>
        </Box>
      }
    />
  );
};

export default ChartEditorPage;