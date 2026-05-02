import { SystemConfigManager } from "../models/SystemConfigManager.cjs";

export const getSystemConfig = (key: string): string | null => {
  return SystemConfigManager.getConfig(key);
};

export const setSystemConfig = (key: string, value: string): void => {
  SystemConfigManager.setConfig(key, value);
};

export const deleteSystemConfig = (key: string): void => {
  SystemConfigManager.deleteConfig(key);
};

const systemService = {
  getSystemConfig,
  setSystemConfig,
  deleteSystemConfig,
};

export default systemService;
