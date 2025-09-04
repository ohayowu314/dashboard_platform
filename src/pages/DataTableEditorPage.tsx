// src/pages/DataTableEditorPage.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { PageWrapper } from "../components/layout/PageWrapper";
import { parseDataFile } from "../utils";
import type { ParsedData } from "../types";

export const DataTableEditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const file: File | null = location.state?.file || null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [tableName, setTableName] = useState<string>(
    file?.name.split(".")[0] || "未命名表格"
  );
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

  const handleConfirm = () => {
    console.log(`確認並儲存表格: ${tableName}`);
    // 這裡可以加入儲存資料到後端的邏輯
    navigate("/data-tables"); // 儲存後導航回列表頁
  };

  const handleCancel = () => {
    console.log("取消編輯");
    navigate("/data-tables"); // 取消後導航回列表頁
  };

  const pageConfig = {
    breadcrumbItems: [
      { label: "資料表格管理", path: "/data-tables" },
      { label: "編輯資料表格", path: "" },
    ],
    content: (
      <Box sx={{ p: 3 }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          {/* 標題區塊 */}
          <Grid size="grow">
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                <Tooltip title="點擊編輯表格名稱">
                  <Box
                    onClick={() => setIsEditingName(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      "&:hover": {
                        "& .MuiTypography-root": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "primary.main",
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
          </Grid>

          {/* 新增：確認與取消按鈕 */}
          <Grid>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ mr: 1 }}
            >
              取消
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleConfirm}
            >
              確認
            </Button>
          </Grid>
        </Grid>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {data && (
          <Box>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              資料預覽
            </Typography>
            {/* 修正：stickyHeader overflow 屬性 須配合高度 */}
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
