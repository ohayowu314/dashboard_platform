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
} from "@mui/material";
import { PageWrapper } from "../components/layout/PageWrapper";
import { parseDataFile } from "../utils";
import type { ParsedData } from "../types";

export const DataTableEditorPage = () => {
  const location = useLocation();
  const file: File | null = location.state?.file || null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        <Typography variant="h4" sx={{ mb: 2 }}>
          編輯資料表格：{file?.name || "無檔案"}
        </Typography>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {data && (
          <Box>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              資料預覽
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
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
    // 這裡可以放編輯時右側面板的內容
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
