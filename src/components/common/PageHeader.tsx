// src/components/common/PageHeader.tsx
import React from "react";
import { Grid } from "@mui/material";

interface PageHeaderProps {
  headerLeftContent: React.ReactNode;
  headerRightContent: React.ReactNode;
  spacing?: number;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  headerLeftContent: leftContent,
  headerRightContent: rightContent,
  spacing = 2,
}) => {
  return (
    <Grid
      container
      sx={{
        mb: spacing,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <Grid size="grow">{leftContent}</Grid>
      <Grid>{rightContent}</Grid>
    </Grid>
  );
};

export default PageHeader;
