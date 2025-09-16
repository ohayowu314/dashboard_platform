// src/components/DataTablesPage/DataTableList.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import type { DataTableInfo } from "shared/types/dataTable";

interface Props {
  dataTables: DataTableInfo[];
  // 新增 viewMode 屬性
  viewMode: "card" | "list";
}

export const DataTableList = ({ dataTables, viewMode }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    tableId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedTableId(tableId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTableId(null);
  };

  const handleAction = (action: string) => {
    console.log(`對表格 ${selectedTableId} 執行操作: ${action}`);
    handleMenuClose();
  };

  // 渲染列表的 Helper 函式
  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>表格名稱</TableCell>
            <TableCell>上傳日期</TableCell>
            <TableCell>檔案大小</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTables.map((table) => (
            <TableRow key={table.id}>
              <TableCell>{table.name}</TableCell>
              <TableCell>{table.updated_at}</TableCell>
              <TableCell>{table.fileSize}</TableCell>
              <TableCell align="right">
                <IconButton
                  aria-label="more"
                  onClick={(e) => handleMenuClick(e, table.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // 渲染卡片的 Helper 函式
  const renderCards = () => (
    <Grid container spacing={3}>
      {dataTables.length > 0 ? (
        dataTables.map((table) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={table.id}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" component="div">
                    {table.name}
                  </Typography>
                  <IconButton
                    aria-label="more"
                    onClick={(e) => handleMenuClick(e, table.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  上傳日期: {table.updated_at}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  檔案大小: {table.fileSize}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" color="text.secondary" align="center">
            沒有找到符合條件的資料表格。
          </Typography>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box>
      {dataTables.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center">
          沒有找到符合條件的資料表格。
        </Typography>
      ) : (
        <>{viewMode === "card" ? renderCards() : renderList()}</>
      )}

      {/* 單一表格操作選單 (保持不變) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction("瀏覽")}>瀏覽</MenuItem>
        <MenuItem onClick={() => handleAction("編輯")}>編輯</MenuItem>
        <MenuItem onClick={() => handleAction("更新")}>更新</MenuItem>
        <MenuItem onClick={() => handleAction("下載")}>下載</MenuItem>
        <MenuItem onClick={() => handleAction("刪除")}>刪除</MenuItem>
      </Menu>
    </Box>
  );
};
