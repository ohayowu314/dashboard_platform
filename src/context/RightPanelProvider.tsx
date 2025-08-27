// context/RightPanelProvider.tsx
import React from "react";
import { useUIStore } from "../stores/uiStore";
import { RightPanelContext } from "./RightPanelContext";

export const RightPanelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setRightPanelContent, setRightPanelEnabled, rightPanelEnabled } = useUIStore();

  const setContent = (content: React.ReactNode) => {
    setRightPanelContent(content);
  };

  const setEnabled = (enabled: boolean) => {
    setRightPanelEnabled(enabled);
    if (!enabled) setRightPanelContent(null); // 清除內容
  };

  const toggleEnabled = () => {
    setRightPanelEnabled(!rightPanelEnabled);
  };

  return (
    <RightPanelContext.Provider value={{ setContent, setEnabled, toggleEnabled }}>
      {children}
    </RightPanelContext.Provider>
  );
};
