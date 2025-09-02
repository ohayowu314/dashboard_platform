// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutProvider";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ChartConfigPage } from "./pages/ChartConfigPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DownloadPage } from "./pages/DownloadPage";
import { TestingPage } from "./pages/TestingPage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {/* CssBaseline 提供了簡潔、一致的 CSS 基礎 */}
        <CssBaseline />
        <LayoutProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="chart-config" element={<ChartConfigPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="download" element={<DownloadPage />} />
              <Route path="testing" element={<TestingPage />} />
            </Route>
          </Routes>
        </LayoutProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
