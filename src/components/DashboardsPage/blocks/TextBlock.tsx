import { Box, Typography } from "@mui/material";
import type { TextBlockConfig } from "shared/types/dashboard";

interface TextBlockProps {
  config: TextBlockConfig;
}

export const TextBlock = ({ config }: TextBlockProps) => {
  const { content, style } = config;
  const {
    fontSize = 14,
    fontWeight = "normal",
    textAlign = "left",
    color,
  } = style || {};

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 1,
      }}
    >
      <Typography
        sx={{
          fontSize,
          fontWeight,
          textAlign,
          color: color || "text.primary",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};

export default TextBlock;