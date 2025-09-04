// src/pages/DataTableEditorPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  TextField, // 新增
  InputAdornment, // 新增
  Tooltip, // 新增
  IconButton, // 新增
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material"; // 新增
import { PageWrapper } from "../components/layout/PageWrapper";
import { parseDataFile } from "../utils";
import type { ParsedData } from "../types";

export const DataTableEditorPage = () => {
  const location = useLocation();
  const file: File | null = location.state?.file || null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 新增：表格名稱狀態，預設為檔案名稱
  const [tableName, setTableName] = useState<string>(
    file?.name.split(".")[0] || "未命名表格"
  );
  // 新增：編輯狀態
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const processFile = async () => {
      if (!file) {
        setError("無檔案資料。請返回資料表格列表頁重新上傳。");
        setLoading(false);
        return;
      }

      try {
        const parsedData = await parseDataFile(file);
        setData(parsedData);
      } catch (e: Error | undefined | unknown) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    processFile();
  }, [file]);

  const pageConfig = {
    breadcrumbItems: [
      { label: "資料表格管理", path: "/data-tables" },
      { label: "編輯資料表格", path: "" },
    ],
    content: (
      <Box sx={{ p: 3 }}>
        {/* 標題區塊：使用 Box 保持水平對齊 */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" sx={{ mr: 1, fontWeight: "bold" }}>
            表格名稱
          </Typography>
          {isEditingName ? (
            <TextField
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              autoFocus
              variant="standard"
              sx={{ flexGrow: 1 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <EditIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          ) : (
            // 修正：將 Typography 和 IconButton 包裝在一個 Box 中，並添加懸停樣式
            <Tooltip title="點擊編輯表格名稱">
              <Box
                onClick={() => setIsEditingName(true)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    "& .MuiTypography-root": {
                      color: "primary.main", // 懸停時變色
                      textDecoration: "underline", // 懸停時加底線
                    },
                    "& .MuiSvgIcon-root": {
                      color: "primary.main", // 懸停時變色
                    },
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="span"
                  sx={{ fontWeight: "bold" }}
                >
                  {tableName}
                </Typography>
                <IconButton size="small" sx={{ ml: 0.5 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {data && (
          <Box>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              資料預覽
            </Typography>
            {/* 修正：將高度和 overflow 屬性直接設定在 TableContainer 上 */}
            <TableContainer
              component={Paper}
              sx={{ height: "70vh", overflow: "auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {data.headers.map((header) => (
                      <TableCell key={header} sx={{ fontWeight: "bold" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    ),
    rightPanelContent: (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">編輯控制面板</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          這裡可以添加欄位類型、篩選、排序等控制項。
        </Typography>
      </Box>
    ),
  };

  return <PageWrapper {...pageConfig} />;
};
