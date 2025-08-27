// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { UploadPage } from "./pages/UploadPage";
import { ChartConfigPage } from "./pages/ChartConfigPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DownloadPage } from "./pages/DownloadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="upload" element={<UploadPage />} />
          <Route path="chart-config" element={<ChartConfigPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="download" element={<DownloadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
