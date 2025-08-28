// src/components/layout/Breadcrumb.tsx
import React, { useState } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../../stores/layoutStore";

export const Breadcrumb: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const breadcrumb = useLayoutStore((state) => state.breadcrumb);

  const handleBreadcrumbClick = (index: number) => {
    const path = "/" + breadcrumb.slice(0, index + 1).join("/");
    navigate(path);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {breadcrumb.length > 3 ? (
        <>
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ cursor: "default", display: "flex", alignItems: "center" }}
          >
            <Typography fontSize={12}>...</Typography>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMouseLeave}
              onMouseLeave={handleMouseLeave}
              slotProps={{ list: { onMouseLeave: handleMouseLeave } }}
            >
              {breadcrumb.slice(0, breadcrumb.length - 2).map((seg, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleBreadcrumbClick(i);
                    handleMouseLeave();
                  }}
                >
                  {seg}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography>{">"}</Typography>
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => handleBreadcrumbClick(breadcrumb.length - 2)}
          >
            {breadcrumb[breadcrumb.length - 2]}
          </Typography>
          <Typography>{">"}</Typography>
          <Typography
            sx={{
              cursor: "pointer",
              fontWeight: "bold",
              color: "primary.main",
            }}
            onClick={() => handleBreadcrumbClick(breadcrumb.length - 1)}
          >
            {breadcrumb[breadcrumb.length - 1]}
          </Typography>
        </>
      ) : (
        breadcrumb.map((seg, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Typography>{">"}</Typography>}
            <Typography
              sx={{
                cursor: "pointer",
                fontWeight: i === breadcrumb.length - 1 ? "bold" : "normal",
                color: i === breadcrumb.length - 1 ? "primary.main" : "inherit",
              }}
              onClick={() => handleBreadcrumbClick(i)}
            >
              {seg}
            </Typography>
          </React.Fragment>
        ))
      )}
    </Box>
  );
};
