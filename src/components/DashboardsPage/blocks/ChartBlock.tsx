import { useMemo } from "react";
import { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
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
import type { ChartBlockConfig, ChartChartBlockConfig, TableChartBlockConfig } from "shared/types/dashboard";
import type { ChartType } from "shared/types/dashboard";
import { useTable } from "../../../hooks/queries/dataTable";

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

interface ChartBlockProps {
  config: ChartBlockConfig;
}

const isChartConfig = (config: ChartBlockConfig): config is ChartChartBlockConfig => config.chartType !== "table";
const isTableConfig = (config: ChartBlockConfig): config is TableChartBlockConfig => config.chartType === "table";

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

type Order = "asc" | "desc";

export const ChartBlock = ({ config }: ChartBlockProps) => {
  const { dataTableId, title, description } = config;

  const { data: tableData, isLoading, error } = useTable(dataTableId);

  const [orderBy, setOrderBy] = useState<string>("");
  const [orderState, setOrderState] = useState<Order>("asc");

  const chartData = useMemo(() => {
    if (!tableData) return [];
    const { headers, rows } = tableData.data;
    return rows.map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
  }, [tableData]);

  const sortedRows = useMemo(() => {
    if (!orderBy) return chartData;
    return [...chartData].sort((a, b) => {
      const aVal = a[orderBy];
      const bVal = b[orderBy];
      if (aVal === bVal) return 0;
      if (typeof aVal !== "number" || typeof bVal !== "number") return 0;
      return orderState === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
  }, [chartData, orderBy, orderState]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !tableData) {
    return (
      <Box sx={{ p: 1 }}>
        <Alert severity="error">{error instanceof Error ? error.message : "無法載入資料"}</Alert>
      </Box>
    );
  }

  const { headers } = tableData.data;

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && orderState === "asc";
    setOrderState(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {title && (
        <Typography variant="subtitle2" sx={{ p: 1, pb: 0, fontWeight: "bold", textAlign: "center" }}>
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="caption" sx={{ px: 1, textAlign: "center", color: "text.secondary" }}>
          {description}
        </Typography>
      )}
      <Box sx={{ flex: 1, p: 1, overflow: "hidden" }}>
        {isTableConfig(config) ? (
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {config.columns?.map((col) => (
                    <TableCell key={col} sx={{ fontWeight: "bold" }}>
                      {config.sortable ? (
                        <TableSortLabel active={orderBy === col} direction={orderBy === col ? orderState : "asc"} onClick={() => handleSort(col)}>
                          {col}
                        </TableSortLabel>
                      ) : col}
                    </TableCell>
                  )) || headers.map((col) => (
                    <TableCell key={col} sx={{ fontWeight: "bold" }}>
                      {config.sortable ? (
                        <TableSortLabel active={orderBy === col} direction={orderBy === col ? orderState : "asc"} onClick={() => handleSort(col)}>
                          {col}
                        </TableSortLabel>
                      ) : col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(config.columns?.length || headers.length)} align="center">
                      <Typography color="text.secondary">無資料</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRows.slice(0, config.pageSize || 10).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {config.columns?.map((col) => (
                        <TableCell key={col}>{String(row[col])}</TableCell>
                      )) || headers.map((col) => (
                        <TableCell key={col}>{String(row[col])}</TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : isChartConfig(config) ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart(config.chartType, chartData, config)}
          </ResponsiveContainer>
        ) : (
          <Typography>Unknown chart type</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChartBlock;