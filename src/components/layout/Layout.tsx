// src/components/layout/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { useLayoutContext } from "../../context/useLayoutContext";
import "./layout.css";

export const Layout: React.FC = () => {
  const { rightPanelEnabled } = useLayoutContext();

  return (
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
  );
};
