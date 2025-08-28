// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutProvider";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { ChartConfigPage } from "./pages/ChartConfigPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DownloadPage } from "./pages/DownloadPage";

function App() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="chart-config" element={<ChartConfigPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="download" element={<DownloadPage />} />
          </Route>
        </Routes>
      </LayoutProvider>
    </BrowserRouter>
  );
}

export default App;
