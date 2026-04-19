import {
  Box,
  CircularProgress,
  Alert,
  Typography,
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
import type { ChartBlockConfig, ChartBlockOptions } from "shared/types/dashboard";
import type { ChartConfig, ChartType } from "shared/types/chart";
import { useChart } from "../../../hooks/queries/chart";

interface ChartBlockProps {
  config: ChartBlockConfig;
}

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

const getChartComponent = (
  type: ChartType,
  data: Record<string, unknown>[],
  config: ChartConfig,
  options?: ChartBlockOptions
) => {
  const { xAxis, yAxis, series } = config;
  const showLegend = options?.showLegend ?? true;
  const showTooltip = options?.showTooltip ?? true;
  const animation = options?.animation ?? true;

  const xKey = xAxis;
  const yKeys = Array.isArray(yAxis) ? yAxis : [yAxis];
  const seriesKeys = series && series.length > 0 ? series : yKeys;

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

  const renderTooltip = showTooltip ? (
    <Tooltip />
  ) : null;

  const renderLegend = showLegend ? <Legend /> : null;

  switch (type) {
    case "bar": {
      return (
        <BarChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {seriesKeys.map((key, index) => (
            <Bar
              key={key as string}
              dataKey={key as string}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              isAnimationActive={animation}
            />
          ))}
        </BarChart>
      );
    }

    case "line": {
      return (
        <LineChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {seriesKeys.map((key, index) => (
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
    }

    case "area": {
      return (
        <AreaChart {...commonProps}>
          {axisProps.CartesianGrid}
          {axisProps.XAxis}
          {axisProps.YAxis}
          {renderTooltip}
          {renderLegend}
          {seriesKeys.map((key, index) => (
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
    }

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

    case "histogram": {
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
    }

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

export const ChartBlock = ({ config }: ChartBlockProps) => {
  const { chartId, title, options } = config;

  const { data: chartData, isLoading, error } = useChart(chartId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !chartData) {
    return (
      <Box sx={{ p: 1 }}>
        <Alert severity="error">
          {error instanceof Error ? error.message : "無法載入圖表"}
        </Alert>
      </Box>
    );
  }

  const { config: chartConfig, data } = chartData;
  const displayTitle = title || chartConfig.title;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {displayTitle && (
        <Typography
          variant="subtitle2"
          sx={{
            p: 1,
            pb: 0,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {displayTitle}
        </Typography>
      )}
      <Box
        sx={{
          flex: 1,
          p: 1,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {getChartComponent(
            chartConfig.type,
            data,
            chartData.config,
            options
          )}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ChartBlock;