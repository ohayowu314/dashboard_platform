import { useState } from "react";
import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { TextBlockConfig } from "shared/types/dashboard";

interface TextBlockEditorProps {
  config: TextBlockConfig;
  onSave: (config: TextBlockConfig) => void;
  onCancel: () => void;
}

export const TextBlockEditor = ({
  config,
  onSave,
  onCancel,
}: TextBlockEditorProps) => {
  const [localConfig, setLocalConfig] = useState<TextBlockConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
  };

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, (localConfig.style?.fontSize || 14) + delta));
    setLocalConfig((prev) => ({
      ...prev,
      style: { ...prev.style, fontSize: newSize },
    }));
  };

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {/* 標題列 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
          編輯文字區塊
        </Typography>
        <Box>
          <IconButton size="small" onClick={onCancel} sx={{ mr: 1 }}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleSave} color="primary">
            <CheckIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* 文字內容 */}
      <TextField
        label="文字內容"
        multiline
        rows={4}
        fullWidth
        value={localConfig.content}
        onChange={(e) =>
          setLocalConfig((prev) => ({ ...prev, content: e.target.value }))
        }
        sx={{ mb: 2 }}
      />

      {/* 字體大小 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ width: 80 }}>
          字體大小
        </Typography>
        <IconButton size="small" onClick={() => handleFontSizeChange(-1)}>
          <ArrowLeftIcon fontSize="small" />
        </IconButton>
        <TextField
          type="number"
          value={localConfig.style?.fontSize || 14}
          onChange={(e) =>
            setLocalConfig((prev) => ({
              ...prev,
              style: { ...prev.style, fontSize: Number(e.target.value) },
            }))
          }
          slotProps={{
            htmlInput: {
              min: 8, max: 72
            }
          }}
          sx={{ width: 70, mx: 1 }}
          size="small"
        />
        <IconButton size="small" onClick={() => handleFontSizeChange(1)}>
          <ArrowRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 字體粗細 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ width: 80 }}>
          字體樣式
        </Typography>
        <ToggleButtonGroup
          value={localConfig.style?.fontWeight || "normal"}
          exclusive
          onChange={(_, value) => {
            if (value) {
              setLocalConfig((prev) => ({
                ...prev,
                style: { ...prev.style, fontWeight: value },
              }));
            }
          }}
          size="small"
        >
          <ToggleButton value="normal">一般</ToggleButton>
          <ToggleButton value="bold">粗體</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 文字對齊 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ width: 80 }}>
          對齊方式
        </Typography>
        <ToggleButtonGroup
          value={localConfig.style?.textAlign || "left"}
          exclusive
          onChange={(_, value) => {
            if (value) {
              setLocalConfig((prev) => ({
                ...prev,
                style: { ...prev.style, textAlign: value },
              }));
            }
          }}
          size="small"
        >
          <ToggleButton value="left">左</ToggleButton>
          <ToggleButton value="center">中</ToggleButton>
          <ToggleButton value="right">右</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 文字顏色 */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ width: 80 }}>
          顏色
        </Typography>
        <input
          type="color"
          value={localConfig.style?.color || "#000000"}
          onChange={(e) =>
            setLocalConfig((prev) => ({
              ...prev,
              style: { ...prev.style, color: e.target.value },
            }))
          }
          style={{ width: 50, height: 30, border: "none", cursor: "pointer" }}
        />
        <TextField
          value={localConfig.style?.color || "#000000"}
          onChange={(e) =>
            setLocalConfig((prev) => ({
              ...prev,
              style: { ...prev.style, color: e.target.value },
            }))
          }
          size="small"
          sx={{ width: 100, ml: 1 }}
        />
      </Box>
    </Box>
  );
};

export default TextBlockEditor;