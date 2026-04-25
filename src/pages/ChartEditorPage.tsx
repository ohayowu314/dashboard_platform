// ChartEditorPage - 區塊 config 編輯入口頁面
import { useState, useMemo, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import type { ChartType } from "shared/types/chart";
import type { ChartBlockConfig, ChartChartBlockConfig, TableChartBlockConfig, DashboardWithConfig } from "shared/types/dashboard";
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
  { value: "table", label: "表格" },
  { value: "bar", label: "柱狀圖" },
  { value: "line", label: "折線圖" },
  { value: "area", label: "區域圖" },
  { value: "pie", label: "圓餅圖" },
  { value: "scatter", label: "散點圖" },
  { value: "histogram", label: "直方圖" },
];

const renderChart = (
  type: Exclude<ChartType, "table">,
  data: Record<string, unknown>[],
  config: ChartChartBlockConfig
) => {
  const { xAxis, yAxis, options } = config;
  const showLegend = options?.showLegend ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const animation = options?.animation ?? true;

  const xKey = xAxis;
  const yKeys = Array.isArray(yAxis) ? yAxis : [yAxis];

  if (data.length === 0) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "text.secondary" }}>
        <Typography>暫無資料</Typography>
      </Box>
    );
  }

  const commonProps = { data, margin: { top: 10, right: 30, left: 0, bottom: 5 } };
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
            <Bar key={key as string} dataKey={key as string} fill={CHART_COLORS[index % CHART_COLORS.length]} isAnimationActive={animation} />
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
            <Line key={key as string} type="monotone" dataKey={key as string} stroke={CHART_COLORS[index % CHART_COLORS.length]} isAnimationActive={animation} />
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
            <Area key={key as string} type="monotone" dataKey={key as string} stroke={CHART_COLORS[index % CHART_COLORS.length]} fill={CHART_COLORS[index % CHART_COLORS.length]} isAnimationActive={animation} />
          ))}
        </AreaChart>
      );
    case "pie": {
      const pieData = data.map((item) => ({ name: item[xKey], value: item[yKeys[0] as string] }));
      return (
        <PieChart>
          {renderTooltip}
          {renderLegend}
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} isAnimationActive={animation}>
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
    }
    case "scatter":
      return (
        <ScatterChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          <Scatter name={yKeys[0] as string} data={data} fill={CHART_COLORS[0]} isAnimationActive={animation} />
        </ScatterChart>
      );
    case "histogram":
      return (
        <BarChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          <Bar dataKey={yKeys[0] as string} fill={CHART_COLORS[0]} isAnimationActive={animation} />
        </BarChart>
      );
    default:
      return <Typography>不支持的類型</Typography>;
  }
};

export const ChartEditorPage = () => {
  const { id, blockId } = useParams<{ id: string; blockId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { returnTo?: string };
  const returnTo = state?.returnTo || `/dashboards/edit/${id}`;

  const [fullDashboard, setFullDashboard] = useState<DashboardWithConfig | null>(null);
  const [config, setConfig] = useState<ChartBlockConfig | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  useEffect(() => {
    const loadDraft = async () => {
      if (id) {
        try {
          const dashboard = await window.api.getDashboardDraft(Number(id));
          setFullDashboard(dashboard);
          const block = dashboard.config.blocks.find((b) => b.id === blockId);
          if (block) {
            setConfig(block.config);
          }
        } catch (e) {
          console.error("載入草稿失敗", e);
        }
        setLoadingDraft(false);
      }
    };
    loadDraft();
  }, [id, blockId]);

  const { data: tables, isLoading: loadingTables } = useAllTableInfos();
  const { data: tableData, isLoading: loadingTableData } = useTable(
    config?.dataTableId || 0,
    { enabled: (config?.dataTableId || 0) > 0 }
  );

  const headers = tableData?.data.headers || [];
  const tableRows = tableData?.data.rows || [];

  const chartData = useMemo(() => {
    if (!tableRows.length || !config) return [];
    return tableRows.map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
  }, [tableRows, headers]);

  if (loadingDraft) {
    return (
      <PageWrapper
        breadcrumbItems={[{ label: "載入中...", path: "" }]}
        content={<Box sx={{ p: 3, display: "flex", justifyContent: "center" }}><CircularProgress /></Box>}
      />
    );
  }

  if (!config) {
    return (
      <PageWrapper
        breadcrumbItems={[{ label: "返回", path: returnTo }]}
        content={<Box sx={{ p: 3 }}>找不到區塊設定</Box>}
      />
    );
  }

  const isLoading = loadingTables || loadingTableData;

  const handleSave = async () => {
    if (!config || !fullDashboard || !blockId) return;

    // 將更新後的區塊合併回完整的儀表板設定
    const updatedBlocks = fullDashboard.config.blocks.map((b) =>
      b.id === blockId ? { ...b, config } : b
    );
    const updatedConfig = { ...fullDashboard.config, blocks: updatedBlocks };

    // 儲存至草稿
    await window.api.saveDashboardDraft(fullDashboard.info.id, updatedConfig);
    
    // 返回儀表板編輯頁面
    navigate(returnTo);
  };

  const handleCancel = () => {
    navigate(returnTo, { replace: true });
  };

  const handleBack = () => {
    navigate(returnTo, { replace: true });
  };

  const isChartOnlyConfig = (cfg: ChartBlockConfig): cfg is ChartChartBlockConfig => cfg.chartType !== "table";
  const isTableOnlyConfig = (cfg: ChartBlockConfig): cfg is TableChartBlockConfig => cfg.chartType === "table";

  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "儀表板", path: returnTo },
        { label: "編輯區塊", path: "" },
      ]}
      content={
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, borderBottom: 1, borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={handleBack}><ArrowBackIcon /></IconButton>
              <Typography variant="h6" sx={{ ml: 1 }}>編輯區塊</Typography>
            </Box>
            <Box>
              <Button startIcon={<CancelIcon />} onClick={handleCancel} sx={{ mr: 1 }}>取消</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>儲存</Button>
            </Box>
          </Box>

          {/* 三欄 */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* 左側 */}
            <Box sx={{ width: 280, borderRight: 1, borderColor: "divider", p: 2, overflow: "auto" }}>
              <Autocomplete
                options={tables || []}
                getOptionLabel={(option) => option.name}
                value={tables?.find((t) => t.id === config.dataTableId) || null}
                onChange={(_, newValue) => {
                  setConfig((prev) => prev ? { ...prev, dataTableId: newValue?.id || 0 } : null);
                }}
                renderInput={(params) => <TextField {...params} label="選擇資料表" size="small" />}
              />

              {isChartOnlyConfig(config) && (
                <>
                  <Autocomplete
                    sx={{ mt: 2 }}
                    options={headers}
                    getOptionLabel={(option) => option}
                    value={config.xAxis || ""}
                    onChange={(_, newValue) => {
                      setConfig((prev) => prev && isChartOnlyConfig(prev) ? { ...prev, xAxis: newValue || "" } : prev);
                    }}
                    renderInput={(params) => <TextField {...params} label="X 軸" size="small" />}
                    disabled={!config.dataTableId}
                  />
                  <Autocomplete
                    multiple
                    sx={{ mt: 2 }}
                    options={headers}
                    getOptionLabel={(option) => option}
                    value={Array.isArray(config.yAxis) ? config.yAxis : []}
                    onChange={(_, newValue) => {
                      setConfig((prev) => prev && isChartOnlyConfig(prev) ? { ...prev, yAxis: newValue } : prev);
                    }}
                    renderInput={(params) => <TextField {...params} label="Y 軸" size="small" />}
                    disabled={!config.dataTableId}
                  />
                </>
              )}

              {isTableOnlyConfig(config) && (
                <Autocomplete
                  multiple
                  sx={{ mt: 2 }}
                  options={headers}
                  getOptionLabel={(option) => option}
                  value={config.columns || []}
                  onChange={(_, newValue) => {
                    setConfig((prev) => prev && isTableOnlyConfig(prev) ? { ...prev, columns: newValue } : prev);
                  }}
                  renderInput={(params) => <TextField {...params} label="顯示欄位" size="small" />}
                  disabled={!config.dataTableId}
                />
              )}
            </Box>

            {/* 中間 */}
            <Box sx={{ flex: 1, p: 2, overflow: "hidden" }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ) : !config.dataTableId ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "text.secondary" }}>
                  <Typography>請選擇資料表</Typography>
                </Box>
              ) : isTableOnlyConfig(config) ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {config.columns?.map((col) => (
                          <TableCell key={col} sx={{ fontWeight: "bold" }}>{col}</TableCell>
                        )) || headers.map((col) => (
                          <TableCell key={col} sx={{ fontWeight: "bold" }}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {chartData.slice(0, 10).map((row, idx) => (
                        <TableRow key={idx}>
                          {config.columns?.map((col) => (
                            <TableCell key={col}>{String(row[col])}</TableCell>
                          )) || headers.map((col) => (
                            <TableCell key={col}>{String(row[col])}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : isChartOnlyConfig(config) ? (
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart(config.chartType, chartData, config)}
                </ResponsiveContainer>
              ) : null}
            </Box>

            {/* 右側 */}
            <Box sx={{ width: 280, borderLeft: 1, borderColor: "divider", p: 2, overflow: "auto" }}>
              <TextField
                label="標題"
                fullWidth
                size="small"
                value={config.title || ""}
                onChange={(e) => setConfig((prev) => prev ? { ...prev, title: e.target.value } : null)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="描述"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={config.description || ""}
                onChange={(e) => setConfig((prev) => prev ? { ...prev, description: e.target.value } : null)}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1, mb: 1 }}>類型</Typography>
              <ToggleButtonGroup
                value={config.chartType}
                exclusive
                onChange={(_, value) => {
                  if (value) {
                    setConfig((prev) => prev ? { ...prev, chartType: value } : null);
                  }
                }}
                size="small"
              >
                {CHART_TYPES.map((ct) => (
                  <ToggleButton key={ct.value} value={ct.value}>{ct.label}</ToggleButton>
                ))}
              </ToggleButtonGroup>

              {isChartOnlyConfig(config) && (
                <>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>選項</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.options?.showLegend ?? true}
                        onChange={(e) => setConfig((prev) => prev && isChartOnlyConfig(prev) ? { ...prev, options: { ...prev.options, showLegend: e.target.checked } } : prev)}
                        size="small"
                      />
                    }
                    label="顯示圖例"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.options?.showTooltip ?? true}
                        onChange={(e) => setConfig((prev) => prev && isChartOnlyConfig(prev) ? { ...prev, options: { ...prev.options, showTooltip: e.target.checked } } : prev)}
                        size="small"
                      />
                    }
                    label="顯示提示"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.options?.animation ?? true}
                        onChange={(e) => setConfig((prev) => prev && isChartOnlyConfig(prev) ? { ...prev, options: { ...prev.options, animation: e.target.checked } } : prev)}
                        size="small"
                      />
                    }
                    label="動畫"
                  />
                </>
              )}

              {isTableOnlyConfig(config) && (
                <>
                  <TextField
                    label="每頁筆數"
                    type="number"
                    fullWidth
                    size="small"
                    value={config.pageSize || 10}
                    onChange={(e) => setConfig((prev) => prev && isTableOnlyConfig(prev) ? { ...prev, pageSize: Math.max(1, Number(e.target.value)) } : prev)}
                    sx={{ mt: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={config.sortable ?? true}
                        onChange={(e) => setConfig((prev) => prev && isTableOnlyConfig(prev) ? { ...prev, sortable: e.target.checked } : prev)}
                        size="small"
                      />
                    }
                    label="可排序"
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      }
    />
  );
};

export default ChartEditorPage;
