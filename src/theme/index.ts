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
  spacing: 8, // 定義一個間距單位
  components: {
    MuiAppBar: {
      // 或 MuiPaper 等，取決於你的元件
      styleOverrides: {
        root: {
          height: 64, // 在這裡定義導覽列高度
        },
      },
    },
  },
});
export default theme;
