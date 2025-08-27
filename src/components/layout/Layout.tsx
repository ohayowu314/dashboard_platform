// components/layout/Layout.tsx
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { RightPanel } from "./RightPanel";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../stores/uiStore";
import "./layout.css";
import { RightPanelProvider } from "../../context/RightPanelProvider";

export const Layout = () => {
  const { rightPanelEnabled } = useUIStore();

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
