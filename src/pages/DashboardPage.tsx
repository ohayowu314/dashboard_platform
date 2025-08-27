import { useEffect } from "react";
import { useUIStore } from "../stores/uiStore";

export const DashboardPage: React.FC = () => {
  const { setRightPanelEnabled, setRightPanelContent } = useUIStore();

  useEffect(() => {
    setRightPanelEnabled(true);
    setRightPanelContent(<div>這是 Dashboard 的右側內容</div>);
    return () => {
      setRightPanelEnabled(true); // 預設啟用
      setRightPanelContent(null);
    };
  }, []);

  return <div>主內容區塊</div>;
};
