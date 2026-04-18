// src/pages/TestingPage.tsx
import { Box, Typography } from "@mui/material";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useLayoutStore } from "../stores/layoutStore";
import SimpleTable from "../components/common/SimpleTable";

const sampleData = [
  {
    year: 2020,
    month: 1,
    value: 100,
  },
  {
    year: 2020,
    month: 2,
    value: <button>測試用</button>,
  },
  {
    year: 2020,
    month: 3,
    value: 200,
  },
];

export const TestingPage = () => {
  const toggleRightPanelEnabled = useLayoutStore(
    (s) => s.toggleRightPanelEnabled,
  );
  return (
    <PageWrapper
      breadcrumbItems={[
        { label: "測試1", path: "/testing1" },
        { label: "測試2", path: "/testing2" },
        { label: "測試3", path: "/testing3" },
        { label: "測試4", path: "/testing4" },
        { label: "測試5", path: "/testing5" },
      ]}
      content={
        <div>
          主內容區塊
          <button
            onClick={() => {
              toggleRightPanelEnabled();
            }}
          >
            測試用:右側邊欄開關
          </button>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Data Table
            </Typography>
            <SimpleTable data={sampleData} />
          </Box>
        </div>
      }
      rightPanelTitle="儀表板右側標題"
      rightPanelContent={
        <div>
          <p>這裡可以放圖表設定、說明、連結等。</p>
        </div>
      }
    />
  );
};
