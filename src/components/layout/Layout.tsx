// components/layout/Layout.tsx
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";
import { useEffect } from "react";
import { RightPanelProvider } from "../../context/RightPanelProvider";

export const Layout = () => {
  const { rightPanelEnabled, rightPanelPinned, setRightPanelVisible } =
    useUIStore();

  useEffect(() => {
    if (!rightPanelEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const panelWidth = 300;
      const threshold = 30;
      const x = e.clientX;

      const isNearRightEdge = window.innerWidth - x <= threshold;
      const isOverPanel = x >= window.innerWidth - panelWidth;

      if (rightPanelPinned) return;

      if (isNearRightEdge || isOverPanel) {
        setRightPanelVisible(true);
      } else {
        setRightPanelVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rightPanelEnabled, rightPanelPinned, setRightPanelVisible]);

  return (
    <RightPanelProvider>
      <div className="layout-container">
        <Sidebar />
        <div className="main-area">
          <TopNav />
          <div className="main-content">
            <Outlet />
          </div>
        </div>

        {rightPanelEnabled && <RightPanel />}
      </div>
    </RightPanelProvider>
  );
};
