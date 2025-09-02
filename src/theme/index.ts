// src/theme/index.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    background: {
      default: "#f4f6f8",
      paper: "#fff",
    },
  },
  appLayout: {
    navHeight: 64,
  },
  spacing: 8, // 定義一個間距單位
});
export default theme;
