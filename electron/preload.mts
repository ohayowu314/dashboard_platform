import { contextBridge } from "electron";
console.log("Preload script loaded");
import { getNames } from "./models/testmgr.mjs";

contextBridge.exposeInMainWorld("api", {
  getNames: () => getNames(),
});
console.log("Preload script end");
