// components/layout/RightPanel.tsx
import React from "react";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";

export const RightPanel: React.FC = () => {
  const { rightPanelEnabled, rightPanelContent } =
    useUIStore();

  if (!rightPanelEnabled) return null;

  return (
    <div className="right-panel">
      {rightPanelContent}
    </div>
  );
};
