// src/pages/DataTablesPage.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import GridViewIcon from "@mui/icons-material/GridView";
import { PageWrapper } from "../components/layout/PageWrapper";
import type { PageConfig } from "../types";
import { DataTableList } from "../components/DataTablesPage/DataTableList";
import { UploadDataTableDialog } from "../components/DataTablesPage/UploadDataTableDialog";

// 假資料，用於模擬從後端獲取的資料
const fakeDataTableInfos = [
  {
    id: "1",
    name: "銷售數據",
    file_path: "ttt.ss.ddf",
    created_at: "2023-10-26",
    updated_at: "2023-10-26",
    fileSize: "1.2 MB",
  },
  {
    id: "2",
    name: "客戶資訊",
    file_path: "ttt.ss.ddf",
    created_at: "2023-10-25",
    updated_at: "2023-10-25",
    fileSize: "800 KB",
  },
  {
    id: "3",
    name: "庫存報表",
    file_path: "ttt.ss.ddf",
    created_at: "2023-10-24",
    updated_at: "2023-10-24",
    fileSize: "3.5 MB",
  },
];

export const DataTablesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  // 根據搜尋關鍵字過濾資料
  const filteredDataTables = fakeDataTableInfos.filter((table) =>
    table.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: "card" | "list"
  ) => {
    // 只有當新模式不為 null 時才更新狀態
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // 頁面配置
  const pageConfig: Omit<PageConfig, "tocItems"> = {
    breadcrumbItems: [{ label: "資料表格管理", path: "/data-tables" }],
    content: (
      <Box sx={{ p: 3 }}>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Grid
            size={{ xs: 12, sm: 6 }}
            container
            alignItems="center"
            spacing={2}
          >
            {/* 標題與模式切換按鈕 */}
            <Grid>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                資料表格管理
              </Typography>
            </Grid>
            <Grid>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="card" aria-label="card view">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <FormatListBulletedIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Grid
            size={{ xs: 12, sm: 6 }}
            container
            justifyContent="flex-end"
            spacing={1}
          >
            {/* 搜尋框 */}
            <Grid>
              <TextField
                label="搜尋表格"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            {/* 上傳按鈕 */}
            <Grid>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                上傳資料表格
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* 將 viewMode 作為 props 傳遞給 DataTableList */}
        <DataTableList dataTables={filteredDataTables} viewMode={viewMode} />

        {/* 上傳資料表格對話框 */}
        <UploadDataTableDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
        />
      </Box>
    ),
  };

  return <PageWrapper {...pageConfig} />;
};
