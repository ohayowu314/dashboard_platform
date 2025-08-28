// src/components/layout/TopNav.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../../stores/layoutStore";

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const breadcrumb = useLayoutStore((state) => state.breadcrumb);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + breadcrumb.slice(0, index + 1).join("/");
    navigate(path);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => setSearchOpen(true);
  const handleSearchClose = () => setSearchOpen(false);

  return (
    <Box
      sx={{
        height: 60,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #ddd",
        bgcolor: "#fff",
      }}
    >
      {/* Breadcrumb 區塊 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {breadcrumb.length > 3 ? (
          <>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(0)}
            >
              {breadcrumb[0]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(breadcrumb.length - 2)}
            >
              {breadcrumb[breadcrumb.length - 2]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(breadcrumb.length - 1)}
            >
              {breadcrumb[breadcrumb.length - 1]}
            </Typography>
            <IconButton size="small" onClick={handleMoreClick}>
              <Typography fontSize={12}>...</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMoreClose}
            >
              {breadcrumb.slice(1, breadcrumb.length - 2).map((seg, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleBreadcrumbClick(i + 1);
                    handleMoreClose();
                  }}
                >
                  {seg}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          breadcrumb.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Typography>{">"}</Typography>}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: i === breadcrumb.length - 1 ? "bold" : "normal",
                }}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {seg}
              </Typography>
            </React.Fragment>
          ))
        )}
      </Box>

      {/* 搜尋按鈕 */}
      <IconButton onClick={handleSearchOpen}>
        <SearchIcon />
      </IconButton>

      {/* 全螢幕搜尋浮層 */}
      <Modal open={searchOpen} onClose={handleSearchClose}>
        <Box
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleSearchClose();
            }
          }}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <TextField
            autoFocus
            placeholder="請輸入搜尋內容..."
            variant="outlined"
            sx={{ width: "60%", bgcolor: "#fff", borderRadius: 1 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
