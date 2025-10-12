import { Typography } from "@mui/material";

// src/components/common/MainTitle.tsx
export const MainTitle = ({ title }: { title: string }) => {
  return (
    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
      {title}
    </Typography>
  );
};
