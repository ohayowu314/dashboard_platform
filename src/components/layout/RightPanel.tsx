// src/components/layout/RightPanel.tsx
import React from "react";
import { useLayoutStore } from "../../stores/layoutStore";
import "./layout.css";

export const RightPanel: React.FC = () => {
  const { rightPanelEnabled, rightPanelContent } = useLayoutStore();

  if (!rightPanelEnabled) return null;

  return <div className="right-panel">{rightPanelContent}</div>;
};
