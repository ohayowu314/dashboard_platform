// src/components/layout/Sidebar.tsx
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Logo from "../common/Logo";
import { TocList } from "./TocList";
import { BugReport, Dashboard, Storage } from "@mui/icons-material";

export const Sidebar = () => {
  // 直接定義固定的導覽項目
  const fixedTocItems = [
    { label: "資料表格管理", path: "/data-tables", icon: <Storage /> },
    { label: "儀表板管理", path: "/dashboards", icon: <Dashboard /> },
    { label: "測試頁面", path: "/testing", icon: <BugReport /> },
  ];
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
      <TocList tocItems={fixedTocItems} />
    </Box>
  );
};
