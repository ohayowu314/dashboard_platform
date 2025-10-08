// src/components/common/GenericListView.tsx
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import type { DataRecord, TableId } from "shared/types/dataTable";

export interface GenericItem {
  id: TableId;
  title: string;
  updated_at?: string;
  metadata?: DataRecord;
}

export interface GenericListViewProps {
  items: GenericItem[];
  viewMode: "card" | "list";
  onClickItem: (id: TableId) => void;
  renderActions?: (id: TableId) => React.ReactNode;
}

export const GenericListView = ({
  items,
  viewMode,
  onClickItem,
  renderActions,
}: GenericListViewProps) => {
  const renderList = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>名稱</TableCell>
            <TableCell>上傳日期</TableCell>
            <TableCell>其他資訊</TableCell>
            <TableCell align="right">操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link onClick={() => onClickItem(item.id)}>{item.title}</Link>
              </TableCell>
              <TableCell>{item.updated_at}</TableCell>
              <TableCell>
                {item.metadata &&
                  Object.entries(item.metadata)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" / ")}
              </TableCell>
              <TableCell align="right">{renderActions?.(item.id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCards = () => (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
          <Card variant="outlined">
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  <Link onClick={() => onClickItem(item.id)}>{item.title}</Link>
                </Typography>
                {renderActions?.(item.id)}
              </Box>
              <Typography variant="body2" color="text.secondary">
                上傳日期: {item.updated_at}
              </Typography>
              {item.metadata &&
                Object.entries(item.metadata).map(([k, v]) => (
                  <Typography key={k} variant="body2" color="text.secondary">
                    {k}: {v}
                  </Typography>
                ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return <Box>{viewMode === "card" ? renderCards() : renderList()}</Box>;
};
