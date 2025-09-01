// src/components/common/DataTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

interface DataTableProps<T extends Record<string, React.ReactNode>> {
  data: T[];
}

const DataTable = <T extends Record<string, React.ReactNode>>({
  data,
}: DataTableProps<T>): React.ReactElement => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ padding: 2 }}>
        <Typography>No data to display.</Typography>
      </Paper>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, i) => (
              <TableCell key={header + i} sx={{ fontWeight: "bold" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {headers.map((header, i) => (
                <TableCell key={`${rowIndex}-${header}-${i}`}>
                  {row[header as keyof T]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
