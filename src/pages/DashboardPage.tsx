import { useEffect } from "react";
import { useRightPanel } from "../context/useRightPanel";
import { Typography } from "@mui/material";

export const DashboardPage: React.FC = () => {
  const { setContent, setEnabled } = useRightPanel();

  useEffect(() => {
    setEnabled(true);
    setContent(
      <div>
        <Typography variant="h6">儀表板右側內容</Typography>
        <p>這裡可以放圖表設定、說明、連結等。</p>
      </div>
    );

    return () => {
      setEnabled(false);
    };
  }, []);

  return <div>主內容區塊</div>;
};
