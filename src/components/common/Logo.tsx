// src/components/common/Logo.tsx
import React from "react";
import { Typography } from "@mui/material";
import logoImage from "../../assets/snake.jpg"; // 根據實際路徑調整

const Logo: React.FC = () => {
  return (
    <Typography variant="h6" fontWeight="bold">
      <img
        src={logoImage}
        alt="Logo"
        style={{ width: "30px", verticalAlign: "middle", marginRight: "8px" }}
      />
      MyDashboard
    </Typography>
  );
};

export default Logo;
