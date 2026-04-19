import { Box, Typography } from "@mui/material";
import type { TextBlockConfig, TextStyleConfig } from "shared/types/dashboard";

interface TextBlockProps {
  config: TextBlockConfig;
}

const getDefaultTitleStyle = (): TextStyleConfig => ({
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "left",
  color: "#000000",
});

const getDefaultContentStyle = (): TextStyleConfig => ({
  fontSize: 14,
  fontWeight: "normal",
  textAlign: "left",
  color: "#333333",
});

export const TextBlock = ({ config }: TextBlockProps) => {
  const { title, titleStyle, content, contentStyle } = config;

  const hasTitle = title && title.trim() !== "";
  const hasContent = content && content.trim() !== "";

  const resolvedTitleStyle = { ...getDefaultTitleStyle(), ...titleStyle };
  const resolvedContentStyle = { ...getDefaultContentStyle(), ...contentStyle };

  if (!hasTitle && !hasContent) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          點擊編輯新增文字
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      {hasTitle && (
        <Typography
          sx={{
            fontSize: resolvedTitleStyle.fontSize,
            fontWeight: resolvedTitleStyle.fontWeight,
            textAlign: resolvedTitleStyle.textAlign,
            color: resolvedTitleStyle.color,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
      )}
      {hasContent && (
        <Typography
          sx={{
            fontSize: resolvedContentStyle.fontSize,
            fontWeight: resolvedContentStyle.fontWeight,
            textAlign: resolvedContentStyle.textAlign,
            color: resolvedContentStyle.color,
            lineHeight: 1.5,
          }}
        >
          {content}
        </Typography>
      )}
    </Box>
  );
};

export default TextBlock;