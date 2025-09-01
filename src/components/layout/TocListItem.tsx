// src/components/layout/TocListItem.tsx
import { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import type { TocItem } from "../../types";

interface Props {
  item: TocItem;
  level: number;
  isExpandable: boolean;
  expandedLevel: number;
  indentPerLevel: number;
}

export const TocListItem = ({
  item,
  level,
  isExpandable,
  expandedLevel,
  indentPerLevel,
}: Props) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isExpandableItem = hasChildren && isExpandable && expandedLevel > level;

  const handleClick = () => {
    if (isExpandableItem) {
      setOpen(!open);
    }
  };

  const Component = isExpandableItem ? "div" : Link;
  const componentProps = isExpandableItem
    ? { onClick: handleClick }
    : { to: item.path };

  return (
    <Box sx={{ pl: level == 0 ? 0 : indentPerLevel }}>
      <ListItemButton component={Component} {...componentProps}>
        {item.icon && <Box sx={{ mr: 1 }}>{item.icon}</Box>}
        <ListItemText primary={item.label} />
        {isExpandableItem &&
          (open ? (
            <ExpandLess fontSize="small" />
          ) : (
            <ExpandMore fontSize="small" />
          ))}
      </ListItemButton>

      {isExpandableItem && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((childItem) => (
              <TocListItem
                key={childItem.path}
                item={childItem}
                level={level + 1}
                isExpandable={isExpandable}
                expandedLevel={expandedLevel}
                indentPerLevel={indentPerLevel}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};
