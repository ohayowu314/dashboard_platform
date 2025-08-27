// components/layout/Layout.tsx
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";

export const Layout = () => {
  const { rightPanelEnabled, setRightPanelVisible, rightPanelVisible } =
    useUIStore();

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-area">
        <TopNav />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      {/* 滑入偵測區域 */}
      {rightPanelEnabled && (
        <div
          className={`right-hover-zone ${rightPanelVisible ? "visible" : ""}`}
          onMouseEnter={() => setRightPanelVisible(true)}
          onMouseLeave={() => setRightPanelVisible(false)}
        />
      )}

      <RightPanel />
    </div>
  );
};
