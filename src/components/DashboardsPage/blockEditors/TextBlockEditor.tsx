import { useState } from "react";
import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TitleIcon from "@mui/icons-material/Title";
import NotesIcon from "@mui/icons-material/Notes";
import type { TextBlockConfig, TextStyleConfig } from "shared/types/dashboard";

interface TextBlockEditorProps {
  config: TextBlockConfig;
  onSave: (config: TextBlockConfig) => void;
  onCancel: () => void;
}

const COLOR_PRESETS = [
  "#000000", "#FFFFFF", "#F44336", "#E91E63", "#9C27B0",
  "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B",
  "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B",
];

const defaultTitleStyle: TextStyleConfig = {
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "left",
  color: "#000000",
};

const defaultContentStyle: TextStyleConfig = {
  fontSize: 14,
  fontWeight: "normal",
  textAlign: "left",
  color: "#333333",
};

interface StyleEditorProps {
  label: string;
  icon: React.ReactNode;
  style: TextStyleConfig;
  onStyleChange: (style: TextStyleConfig) => void;
}

const StyleEditor = ({ label, icon, style, onStyleChange }: StyleEditorProps) => {
  const [colorAnchor, setColorAnchor] = useState<HTMLButtonElement | null>(null);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, (style.fontSize || 14) + delta));
    onStyleChange({ ...style, fontSize: newSize });
  };

  const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const handleColorClose = () => setColorAnchor(null);

  const handleColorSelect = (color: string) => {
    onStyleChange({ ...style, color });
    handleColorClose();
  };

  const currentColor = style.color || "#000000";

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon}
        <Typography variant="body2" fontWeight="medium" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 3 }}>
        {/* 字體大小 */}
        <IconButton size="small" onClick={() => handleFontSizeChange(-1)} sx={{ border: "1px solid", borderColor: "divider" }}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <TextField
          type="number"
          value={style.fontSize || 14}
          onChange={(e) => onStyleChange({ ...style, fontSize: Math.max(8, Math.min(72, Number(e.target.value))) })}
          sx={{ width: 55 }}
          size="small"
        />
        <IconButton size="small" onClick={() => handleFontSizeChange(1)} sx={{ border: "1px solid", borderColor: "divider" }}>
          <AddIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>px</Typography>

        {/* 字體樣式 */}
        <ToggleButtonGroup
          value={style.fontWeight || "normal"}
          exclusive
          size="small"
          onChange={(_, value) => value && onStyleChange({ ...style, fontWeight: value })}
        >
          <ToggleButton value="normal">標準</ToggleButton>
          <ToggleButton value="bold">粗體</ToggleButton>
        </ToggleButtonGroup>

        {/* 對齊方式 */}
        <ToggleButtonGroup
          value={style.textAlign || "left"}
          exclusive
          size="small"
          onChange={(_, value) => value && onStyleChange({ ...style, textAlign: value })}
        >
          <ToggleButton value="left">左</ToggleButton>
          <ToggleButton value="center">中</ToggleButton>
          <ToggleButton value="right">右</ToggleButton>
        </ToggleButtonGroup>

        {/* 顏色 */}
        <IconButton
          onClick={handleColorClick}
          sx={{ border: "1px solid", borderColor: "divider", p: 0.5 }}
        >
          <Box sx={{ width: 20, height: 20, backgroundColor: currentColor, borderRadius: 0.5 }} />
        </IconButton>
        <TextField
          value={currentColor}
          onChange={(e) => onStyleChange({ ...style, color: e.target.value })}
          size="small"
          sx={{ width: 75 }}
        />
      </Box>

      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={handleColorClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 1 }}>
          <List dense sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0.5, width: 150 }}>
            {COLOR_PRESETS.map((color) => (
              <ListItem key={color} disablePadding>
                <ListItemButton
                  onClick={() => handleColorSelect(color)}
                  sx={{ p: 0.5, border: color === currentColor ? "2px solid" : "1px solid", borderColor: color === currentColor ? "primary.main" : "divider" }}
                >
                  <Box sx={{ width: 20, height: 20, backgroundColor: color }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export const TextBlockEditor = ({
  config,
  onSave,
  onCancel,
}: TextBlockEditorProps) => {
  const [localConfig, setLocalConfig] = useState<TextBlockConfig>({
    title: config.title || "",
    titleStyle: { ...defaultTitleStyle, ...config.titleStyle },
    content: config.content || "",
    contentStyle: { ...defaultContentStyle, ...config.contentStyle },
  });

  const handleSave = () => {
    onSave(localConfig);
  };

  return (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      {/* 標題列 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">編輯文字區塊</Typography>
        <Box>
          <IconButton size="small" onClick={onCancel} sx={{ mr: 1 }}><CloseIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={handleSave} color="primary"><CheckIcon fontSize="small" /></IconButton>
        </Box>
      </Box>

      {/* 標題 */}
      <TextField
        label="標題"
        fullWidth
        value={localConfig.title}
        onChange={(e) => setLocalConfig((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="輸入標題..."
        sx={{ mb: 1 }}
      />
      <StyleEditor
        label="標題樣式"
        icon={<TitleIcon fontSize="small" />}
        style={localConfig.titleStyle || defaultTitleStyle}
        onStyleChange={(style) => setLocalConfig((prev) => ({ ...prev, titleStyle: style }))}
      />

      <Divider sx={{ my: 2 }} />

      {/* 描述 */}
      <TextField
        label="描述"
        fullWidth
        multiline
        rows={2}
        value={localConfig.content}
        onChange={(e) => setLocalConfig((prev) => ({ ...prev, content: e.target.value }))}
        placeholder="輸入描述..."
        sx={{ mb: 1 }}
      />
      <StyleEditor
        label="描述樣式"
        icon={<NotesIcon fontSize="small" />}
        style={localConfig.contentStyle || defaultContentStyle}
        onStyleChange={(style) => setLocalConfig((prev) => ({ ...prev, contentStyle: style }))}
      />

      <Divider sx={{ my: 2 }} />

      {/* 即時預覽 */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>預覽</Typography>
      <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, minHeight: 60, overflow: "auto" }}>
        {(localConfig.title || localConfig.content) ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {localConfig.title && (
              <Typography
                sx={{
                  fontSize: localConfig.titleStyle?.fontSize || 18,
                  fontWeight: localConfig.titleStyle?.fontWeight || "bold",
                  textAlign: localConfig.titleStyle?.textAlign || "left",
                  color: localConfig.titleStyle?.color || "#000000",
                }}
              >
                {localConfig.title}
              </Typography>
            )}
            {localConfig.content && (
              <Typography
                sx={{
                  fontSize: localConfig.contentStyle?.fontSize || 14,
                  fontWeight: localConfig.contentStyle?.fontWeight || "normal",
                  textAlign: localConfig.contentStyle?.textAlign || "left",
                  color: localConfig.contentStyle?.color || "#333333",
                }}
              >
                {localConfig.content}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            預覽文字內容
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TextBlockEditor;