import { IpcMainListener } from "../types.cjs";
import systemService from "../services/SystemService.cjs";

export const SystemAPIHandlers: Record<string, IpcMainListener> = {
  "get-system-config": (_event, key: string) =>
    systemService.getSystemConfig(key),

  "set-system-config": (_event, { key, value }: { key: string; value: string }) =>
    systemService.setSystemConfig(key, value),

  "delete-system-config": (_event, key: string) =>
    systemService.deleteSystemConfig(key),
};
