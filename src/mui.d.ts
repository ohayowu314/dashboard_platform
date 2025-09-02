// src/mui.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    appLayout: {
      navHeight: number;
    };
  }
  interface ThemeOptions {
    appLayout?: {
      navHeight?: number;
    };
  }
}
