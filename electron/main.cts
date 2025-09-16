import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/mainWindow.cjs";
import { APIModule } from "./ipc/APIModule.cjs";
console.log("Main process started");
app.whenReady().then(() => {
  console.log(`This platform is ${process.platform}`);
  console.log(`App path is ${app.getAppPath()}`);
  console.log(`Current directory is ${__dirname}`);
  console.log(`Current file is ${__filename}`);
  APIModule.init();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    console.log("App closed");
  }
});
