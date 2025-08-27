// components/layout/Sidebar.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import logoImage from "../../assets/snake.jpg";

const tocMap: Record<string, string[]> = {
  "/upload": ["上傳資料", "資料預覽"],
  "/chart-config": ["選擇資料表", "設定圖表"],
  "/dashboard": ["儀表板配置", "圖表管理"],
  "/download": ["匯出圖片", "匯出設定"],
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const tocItems = tocMap[currentPath] || [];

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold">
          <img
            src={logoImage}
            alt="A description of my image"
            style={{ width: "30px" }}
          />{" "}
          MyDashboard
        </Typography>
      </Box>

      {/* TOC 區塊 */}
      <List>
        {tocItems.map((item, index) => (
          <ListItemButton key={index} sx={{ color: "#fff" }}>
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
