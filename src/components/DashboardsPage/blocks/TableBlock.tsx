import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import type { TableBlockConfig } from "shared/types/dashboard";
import type { DataTableWithInfo } from "shared/types/dataTable";

interface TableBlockProps {
  config: TableBlockConfig;
}

type Order = "asc" | "desc";

export const TableBlock = ({ config }: TableBlockProps) => {
  const { dataTableId, columns, sortable = true } = config;

  const [data, setData] = useState<DataTableWithInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<Order>("asc");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await window.api.getTable(dataTableId);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "載入失敗");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dataTableId]);

  const handleSort = (property: string) => {
    if (!sortable) return;
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 1 }}>
        <Alert severity="error">{error || "無法載入資料"}</Alert>
      </Box>
    );
  }

  const { headers, rows } = data.data;
  const displayColumns = columns && columns.length > 0 ? columns : headers;

  const sortedRows = [...rows].sort((a, b) => {
    if (!orderBy) return 0;
    const colIndex = headers.indexOf(orderBy);
    if (colIndex === -1) return 0;
    const aVal = a[colIndex];
    const bVal = b[colIndex];
    if (aVal === bVal) return 0;
    if (typeof aVal !== "number" || typeof bVal !== "number") return 0;
    if (order === "asc") {
      return aVal < bVal ? -1 : 1;
    }
    return aVal > bVal ? -1 : 1;
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {displayColumns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: "bold" }}>
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === col}
                      direction={orderBy === col ? order : "asc"}
                      onClick={() => handleSort(col)}
                    >
                      {col}
                    </TableSortLabel>
                  ) : (
                    col
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length} align="center">
                  <Typography color="text.secondary">無資料</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {displayColumns.map((_, colIndex) => (
                    <TableCell key={colIndex}>{row[colIndex]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableBlock;