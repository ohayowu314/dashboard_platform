import { app, BrowserWindow } from "electron";
import path from "path";
import { isDevelopment } from "./utils.mjs";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      sandbox: false,
      preload: path.join(app.getAppPath(), "dist-electron", "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the Vite dev server URL
  if (isDevelopment()) {
    mainWindow.loadURL("http://localhost:5173"); // Replace with your Vite dev server port
  } else {
    // Load the local file for production builds
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
};

app.whenReady().then(() => {
  console.log(`This platform is ${process.platform}`);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    console.log("App closed");
  }
});
