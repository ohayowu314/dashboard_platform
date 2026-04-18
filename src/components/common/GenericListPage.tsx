// src/components/common/GenericListPage.tsx
import {
  Box,
  Grid,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import { useState } from "react";
import { MainTitle } from "./MainTitle";

export interface GenericListPageProps<T> {
  title: string;
  items: T[];
  viewMode?: "card" | "list";
  searchable?: boolean;
  uploadable?: boolean;
  creatable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (keyword: string) => void;
  onCreate?: () => void;
  onUpload?: () => void;
  renderList: (items: T[], viewMode: "card" | "list") => React.ReactNode;
}

export function GenericListPage<T>({
  title,
  items,
  viewMode = "card",
  searchable = true,
  uploadable = false,
  creatable = false,
  searchPlaceholder = "搜尋",
  onSearch,
  onCreate,
  onUpload,
  renderList,
}: GenericListPageProps<T>) {
  const [searchText, setSearchText] = useState("");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchText(keyword);
    onSearch?.(keyword);
  };

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    mode: "card" | "list",
  ) => {
    if (mode) setCurrentViewMode(mode);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Grid
          size={{ xs: 12, sm: 6 }}
          container
          sx={{ alignItems: "center" }}
          spacing={2}
        >
          <Grid>
            {/* 標題 */}
            <MainTitle title={title} />
          </Grid>
          <Grid>
            {/* 模式切換按鈕 */}
            <ToggleButtonGroup
              value={currentViewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
              sx={{ mt: 1 }}
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

        <Grid size={{ xs: 12, sm: 6 }}>
          <Grid container sx={{ justifyContent: "flex-end" }} spacing={1}>
            {searchable /* 搜尋框 */ && (
              <Grid>
                <TextField
                  label={searchPlaceholder}
                  variant="outlined"
                  size="small"
                  value={searchText}
                  onChange={handleSearchChange}
                />
              </Grid>
            )}
            {creatable /* 新增按鈕 */ && (
              <Grid>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onCreate}
                >
                  新增
                </Button>
              </Grid>
            )}
            {uploadable /* 上傳按鈕 */ && (
              <Grid>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={onUpload}
                >
                  上傳
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* 列表內容 */}
      {renderList(items, currentViewMode)}
    </Box>
  );
}
