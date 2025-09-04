// src/components/layout/TopNav.tsx
import { useState } from "react";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Breadcrumb } from "./Breadcrumb";
import { useTheme } from "@mui/material/styles";

export const TopNav = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();

  const appBarHeight = theme.appLayout.navHeight;

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchValue(""); // 關閉時清空搜尋值
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      // 在此處執行搜尋邏輯，例如：
      // 1. 根據 searchValue 導航到搜尋結果頁面
      // 2. 在當前頁面觸發搜尋
      console.log("Searching for:", searchValue);
      handleSearchClose();
    }
  };

  return (
    <Box
      sx={{
        height: appBarHeight || 64,
        px: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* 頁面標題與 Breadcrumb 區塊 */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumb />
      </Box>

      {/* 搜尋按鈕 */}
      <IconButton onClick={handleSearchOpen}>
        <SearchIcon />
      </IconButton>

      {/* 全螢幕搜尋浮層 */}
      <Modal open={searchOpen} onClose={handleSearchClose}>
        <TextField
          autoFocus
          placeholder="請輸入搜尋內容..."
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleSearchSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            bgcolor: "#fff",
            borderRadius: 1,
          }}
        />
      </Modal>
    </Box>
  );
};
