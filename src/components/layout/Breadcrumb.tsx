// src/components/layout/Breadcrumb.tsx
import { useState } from "react";
import {
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "../../stores/layoutStore";
import type { BreadcrumbItem } from "../../types";

export const Breadcrumb = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const breadcrumbItems: BreadcrumbItem[] = useLayoutStore(
    (state) => state.breadcrumbItems
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 小螢幕判斷

  const getBreadcrumbPath = (index: number) =>
    "/" +
    breadcrumbItems
      .slice(0, index + 1)
      .map((item) => item.path.replace(/^\//, ""))
      .join("/");

  const handleNavigate = (index: number) => {
    navigate(getBreadcrumbPath(index));
    setAnchorEl(null);
  };

  // 判斷可見項目
  const visibleItems = (() => {
    if (breadcrumbItems.length <= 1) return breadcrumbItems;

    if (isMobile) {
      // 小螢幕只顯示最後一個
      return [breadcrumbItems[breadcrumbItems.length - 1]];
    } else if (breadcrumbItems.length > 3) {
      // 桌面端顯示最後兩個
      return breadcrumbItems.slice(-2);
    } else {
      return breadcrumbItems;
    }
  })();

  const hasCollapsedMenu =
    (isMobile && breadcrumbItems.length > 1) ||
    (!isMobile && breadcrumbItems.length > 3);

  return (
    <>
      {/* 折疊選單 */}
      {hasCollapsedMenu && (
        <Menu
          id="breadcrumb-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {breadcrumbItems
            .slice(0, breadcrumbItems.length - visibleItems.length)
            .map((item, index) => (
              <MenuItem key={item.path} onClick={() => handleNavigate(index)}>
                {item.label}
              </MenuItem>
            ))}
        </Menu>
      )}

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumbs"
      >
        {/* 折疊按鈕 */}
        {hasCollapsedMenu && (
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ p: 0.5 }}
          >
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        )}

        {/* 直接顯示的項目 */}
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          const actualIndex =
            breadcrumbItems.length - visibleItems.length + index;

          return isLast ? (
            <Typography
              key={item.path}
              color="text.primary"
              sx={{ fontWeight: "bold" }}
            >
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.path}
              color="inherit"
              underline="hover"
              component="button"
              onClick={() => handleNavigate(actualIndex)}
            >
              {item.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    </>
  );
};
