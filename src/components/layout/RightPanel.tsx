// src/components/layout/RightPanel.tsx
import { useLayoutStore } from "../../stores/layoutStore";
import "./layout.css";

export const RightPanel = () => {
  const { rightPanelEnabled, rightPanelContent } = useLayoutStore();

  if (!rightPanelEnabled) return null;

  return <div className="right-panel">{rightPanelContent}</div>;
};
