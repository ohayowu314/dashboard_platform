import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
} from "@mui/material";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import type { BlockType } from "shared/types/dashboard";

interface BlockTypeSelectorProps {
  open?: boolean;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "文字", icon: <TextFieldsIcon sx={{ fontSize: 32 }} /> },
  { type: "chart", label: "圖表", icon: <BarChartIcon sx={{ fontSize: 32 }} /> },
  { type: "table", label: "表格", icon: <TableChartIcon sx={{ fontSize: 32 }} /> },
];

export const BlockTypeSelector = ({
  open = true,
  onSelect,
  onClose,
}: BlockTypeSelectorProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>新增區塊</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            py: 2,
          }}
        >
          {blockTypes.map(({ type, label, icon }) => (
            <Button
              key={type}
              variant="outlined"
              onClick={() => onSelect(type)}
              sx={{
                flexDirection: "column",
                py: 3,
                px: 4,
                minWidth: 100,
                borderColor: "grey.300",
                "&:hover": {
                  borderColor: "primary.main",
                  backgroundColor: "primary.light",
                },
              }}
            >
              {icon}
              <Box sx={{ mt: 1 }}>{label}</Box>
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BlockTypeSelector;