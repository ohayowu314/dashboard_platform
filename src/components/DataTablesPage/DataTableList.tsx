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
  Link,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import type { DataTableInfo } from "shared/types/dataTable";
import { DeleteWarningDialog } from "../common/DeleteWarningDialog";
import { useNavigate } from "react-router-dom";
import type { EditTableNavigateState } from "src/types";

interface Props {
  dataTables: DataTableInfo[];
  // 新增 viewMode 屬性
  viewMode: "card" | "list";
  refreshTableInfos: () => void;
}

export const DataTableList = ({
  dataTables,
  viewMode,
  refreshTableInfos,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTableId, setSelectedTableId] = useState<
    string | number | null
  >(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleTableClick = (
    _event: React.MouseEvent<HTMLElement>,
    tableId: string | number
  ) => {
    console.log(`點擊了表格 ${tableId}`);
    const state: EditTableNavigateState = {
      editorMode: "edit",
      tableId: tableId,
    };
    navigate("/data-tables/edit", {
      state,
    });
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    tableId: string | number
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

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    handleMenuClose();
  };
  const openDeleteDialog = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };
  const handleConfirmDelete = () => {
    console.log(`刪除表格 ${selectedTableId}`);
    window.api.deleteTable(selectedTableId!);
    setOpenDialog(false);
    handleMenuClose();
    refreshTableInfos();
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
              <TableCell>
                <Link onClick={(e) => handleTableClick(e, table.id)}>
                  {table.name}
                </Link>
              </TableCell>
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
                    <Link onClick={(e) => handleTableClick(e, table.id)}>
                      {table.name}
                    </Link>
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
        <MenuItem onClick={() => handleAction("更新")}>更新</MenuItem>
        <MenuItem onClick={() => handleAction("下載")}>下載</MenuItem>
        <MenuItem onClick={() => openDeleteDialog()}>刪除</MenuItem>
      </Menu>
      <DeleteWarningDialog
        title="刪除資料表格"
        content="確定要刪除這個資料表格嗎？此操作無法復原。"
        open={openDialog}
        handleClose={closeDeleteDialog}
        handleComfirm={handleConfirmDelete}
      />
    </Box>
  );
};
