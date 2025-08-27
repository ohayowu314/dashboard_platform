// components/layout/TopNav.tsx
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
import { useNavigate, useLocation } from "react-router-dom";

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
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
        {pathSegments.length > 3 ? (
          <>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(0)}
            >
              {pathSegments[0]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 2)}
            >
              {pathSegments[pathSegments.length - 2]}
            </Typography>
            <Typography>{">"}</Typography>
            <Typography
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(pathSegments.length - 1)}
            >
              {pathSegments[pathSegments.length - 1]}
            </Typography>
            <IconButton size="small" onClick={handleMoreClick}>
              <Typography fontSize={12}>...</Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMoreClose}
            >
              {pathSegments.slice(1, pathSegments.length - 2).map((seg, i) => (
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
          pathSegments.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Typography>{">"}</Typography>}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontWeight: i === pathSegments.length - 1 ? "bold" : "normal",
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
