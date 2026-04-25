import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. 分割 Material UI 相關模組
          if (id.includes("@mui") || id.includes("@emotion")) {
            return "mui";
          }

          // 2. 分割 React 相關核心模組
          if (id.includes("react")) {
            return "react";
          }

          // 3. 分割常用、穩定工具模組
          const commonLibs = [
            "recharts",
            "zod",
            "zustand",
            "file-saver",
            "jszip",
            "papaparse",
          ];
          if (commonLibs.some((lib) => id.includes(`node_modules/${lib}`))) {
            return "common-vendor";
          }

          // 4. 其餘較不常用或體積較小的第三方模組
          if (id.includes("node_modules/")) {
            return "rest-vendor";
          }
          return null;
        },
      },
    },
    outDir: "dist-react",
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
