// src/components/common/DataTable.tsx
import React from "react";
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
} from "@mui/material";
import EditableCell from "./EditableCell";
import type { ParsedData } from "shared/types";

interface DataTableProps {
  data: ParsedData;
  onCellChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowIndex: number,
    colIndex: number
  ) => void;
  title?: string;
  maxHeight?: string;
  maxWidth?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onCellChange,
  title = "資料預覽",
  maxHeight = "72vh",
  maxWidth = "67vw",
}) => {
  const cellStyles = {
    fontWeight: "bold",
    minWidth: "150px",
    maxWidth: "250px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as const;

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {title}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ width: maxWidth, height: maxHeight, overflow: "auto" }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {data.headers.map((header) => (
                <TableCell key={header} sx={cellStyles}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <EditableCell
                    key={cellIndex}
                    rowIndex={rowIndex}
                    colIndex={cellIndex}
                    value={cell}
                    onChange={onCellChange}
                  />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DataTable;
