// components/layout/RightPanel.tsx
import React from "react";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";
import { IconButton } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

export const RightPanel: React.FC = () => {
  const {
    rightPanelEnabled,
    rightPanelVisible,
    rightPanelContent,
    rightPanelPinned,
    setRightPanelPinned,
  } = useUIStore();

  if (!rightPanelEnabled) return null;

  return (
    <div
      className={`right-panel ${rightPanelVisible || rightPanelPinned ? "visible" : ""}`}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "4px" }}
      >
        <IconButton
          size="small"
          onClick={() => {
            setRightPanelPinned(!rightPanelPinned);
            console.log("rightPanelPinned:", !rightPanelPinned);
          }}
          title={rightPanelPinned ? "取消釘選" : "釘選面板"}
        >
          <PushPinIcon color={rightPanelPinned ? "primary" : "disabled"} />
        </IconButton>
      </div>
      <div style={{ padding: "8px" }}>{rightPanelContent}</div>
    </div>
  );
};
