import { app } from "electron";
import path from "path";
const userDataPath = app.getPath("userData"); // User data directory 可讀寫
const appPath = app.getAppPath(); // Application root directory 僅可讀取
const isDevelopment: boolean = process.env.NODE_ENV === "development";
const preloadPath = path.join(
  appPath,
  "dist-electron",
  "electron",
  "preload.cjs"
);
const indexHtmlPath = path.join(appPath, "dist-react", "index.html");
const localhost = "http://localhost:5173"; // Replace with your Vite dev server port
const databasePath = path.join(userDataPath, "app.db");

export {
  appPath,
  databasePath,
  userDataPath,
  preloadPath,
  indexHtmlPath,
  isDevelopment,
  localhost,
};
