import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TableChart as TableIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useAllDashboards } from "../hooks/queries/dashboard";
import {
  useSystemConfig,
  SYSTEM_CONFIG_KEYS,
} from "../hooks/queries/systemConfig";

export const HomePage = () => {
  const navigate = useNavigate();
  const { data: dashboards, isLoading: isLoadingDashboards } = useAllDashboards();
  const { data: defaultDashboardIdStr, isLoading: isLoadingConfig } =
    useSystemConfig(SYSTEM_CONFIG_KEYS.DEFAULT_DASHBOARD_ID);

  const isLoading = isLoadingDashboards || isLoadingConfig;
  const hasDashboards = !!(dashboards && dashboards.length > 0);

  useEffect(() => {
    // 如果載入完成且有儀表板，則進行重新導向
    if (!isLoading && hasDashboards) {
      const defaultId = defaultDashboardIdStr ? parseInt(defaultDashboardIdStr, 10) : null;
      // 檢查預設 ID 是否有效且存在於清單中
      const hasDefault = defaultId !== null && dashboards.some(d => d.id === defaultId);
      const targetId = hasDefault ? defaultId : dashboards[0].id;

      navigate(`/dashboards/view/${targetId}`, { replace: true });
    }
  }, [isLoading, hasDashboards, dashboards, defaultDashboardIdStr, navigate]);

  // 只有在載入完成且確定沒有儀表板時，才顯示首頁內容；否則顯示載入中（包含正在重新導向的過程）
  const showWelcomePage = !isLoading && !hasDashboards;

  if (!showWelcomePage) {
    return (
      <PageWrapper
        breadcrumbItems={[{ label: "首頁", path: "/" }]}
        content={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
            }}
          >
            <CircularProgress size={60} />
            <Typography sx={{ mt: 2 }}>正在載入您的數據世界...</Typography>
          </Box>
        }
      />
    );
  }

  return (
    <PageWrapper
      breadcrumbItems={[{ label: "首頁", path: "/" }]}
      content={
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src="./snake.png"
              alt="Snake Logo"
              sx={{
                width: 180,
                height: 180,
                mb: 4,
                filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.1))",
              }}
            />

            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }} >
              歡迎使用 Dashboard Platform
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 600 }}>
              開啟您的數據洞察之旅。在這裡，您可以輕鬆將資料轉換為直觀、具互動性的視覺化圖表。
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 4,
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                    transform: "translateY(-4px)",
                  },
                  cursor: "pointer",
                  width: { xs: "100%", sm: 280 },
                }}
                onClick={() => navigate("/data-tables")}
              >
                <TableIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  管理數據資料
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  上傳 Excel 或 CSV 檔案，準備您的數據來源。
                </Typography>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2 }}
                >
                  前往資料表
                </Button>
              </Paper>

              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 4,
                  borderRadius: 4,
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "secondary.main",
                    bgcolor: "action.hover",
                    transform: "translateY(-4px)",
                  },
                  cursor: "pointer",
                  width: { xs: "100%", sm: 280 },
                }}
                onClick={() => navigate("/dashboards")}
              >
                <DashboardIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  建立儀表板
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  設計您的專屬儀表板，自由組合各種圖表區塊。
                </Typography>
                <Button
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2 }}
                >
                  管理儀表板
                </Button>
              </Paper>
            </Stack>
          </Box>
        </Container>
      }
    />
  );
};
