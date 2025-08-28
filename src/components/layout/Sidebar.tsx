// src/components/layout/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import Logo from "../common/Logo";
import type { TocItem } from "../../types";
import { useLayoutStore } from "../../stores/layoutStore";

export const Sidebar: React.FC = () => {
  const tocItems: TocItem[] = useLayoutStore((state) => state.tocItems);
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#1e1e2f",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* Logo 區塊 */}
      <Box
        sx={{
          mb: 4,
          textDecoration: "none", // 取消底線
          "&:hover": {
            textDecoration: "none", // 滑鼠停留時也取消底線
          },
          color: "inherit", // 繼承文字顏色
        }}
        component={Link}
        to="/"
      >
        <Logo />
      </Box>

      {/* TOC 區塊 */}
      <List>
        {tocItems.map((item) => (
          <ListItemButton key={item.path} component={Link} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
