// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ChartEditorPage } from "./pages/ChartEditorPage";
import { DashboardsPage } from "./pages/DashboardsPage";
import { DownloadPage } from "./pages/DownloadPage";
import { TestingPage } from "./pages/TestingPage";
import { ChartsPage } from "./pages/ChartsPage";
import { ChartViewPage } from "./pages/ChartViewPage";
import { DataTableEditorPage } from "./pages/DataTableEditorPage";
import { DataTablesPage } from "./pages/DataTablesPage";
import theme from "./theme";
import { DashboardEditorPage } from "./pages/DashboardEditorPage";
import { DashboardViewPage } from "./pages/DashboardViewPage";
import { GlobalToast } from "./components/common/GlobalToast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  if (typeof window === "undefined") {
    throw Error("App should only render on the client.");
  }
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <ThemeProvider theme={theme}>
          {/* CssBaseline 提供了簡潔、一致的 CSS 基礎 */}
          <CssBaseline />
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="charts/edit/:id" element={<ChartEditorPage />} />
            <Route path="charts" element={<ChartsPage />} />
            <Route path="charts/view/:id" element={<ChartViewPage />} />
            <Route path="dashboards" element={<DashboardsPage />} />
            <Route
              path="dashboards/edit/:id"
              element={<DashboardEditorPage />}
            />
            <Route path="dashboards/view/:id" element={<DashboardViewPage />} />
            <Route path="data-tables/edit" element={<DataTableEditorPage />} />
            <Route path="data-tables" element={<DataTablesPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="download" element={<DownloadPage />} />
            <Route path="testing" element={<TestingPage />} />
          </Route>
        </Routes>
        <GlobalToast />
        </ThemeProvider>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
