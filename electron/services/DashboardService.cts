import { FileManager } from "../models/FileManager.cjs";
import { DashboardManager } from "../models/DashboardManager.cjs";
import {
  DashboardInfo,
  DashboardConfig,
  DashboardWithConfig,
} from "shared/types/dashboard";

export const createDashboard = (
  name: string,
  description: string | undefined,
  config: DashboardConfig
): DashboardWithConfig => {
  const existing = DashboardManager.getDashboardByName(name);
  if (existing) {
    throw new Error(`儀表板名稱 "${name}" 已存在`);
  }

  const dashboardDirectory = FileManager.getUserDataPath(
    "dashboards",
    `${Date.now()}_${name}`
  );
  FileManager.ensureDirectory(dashboardDirectory);

  const configPath = FileManager.saveFile(
    dashboardDirectory,
    "config.json",
    config
  );
  const previewPath = FileManager.saveFile(dashboardDirectory, "preview.png", "");

  const dashboardInfo = DashboardManager.addDashboard({
    name,
    description,
    config_path: configPath,
    preview_path: previewPath,
  });

  return { info: dashboardInfo, config };
};

export const getAllDashboards = (): DashboardInfo[] => {
  return DashboardManager.getAllDashboards();
};

export const getDashboardById = (
  id: number
): DashboardWithConfig => {
  const dashboardInfo = DashboardManager.getDashboardById(id);
  if (!dashboardInfo) {
    throw new Error("儀表板不存在");
  }

  const configContent = FileManager.readFile(dashboardInfo.config_path);
  const config: DashboardConfig = JSON.parse(configContent);

  return { info: dashboardInfo, config };
};

export const getDashboardDraft = (
  id: number
): DashboardWithConfig => {
  const dashboardInfo = DashboardManager.getDashboardById(id);
  if (!dashboardInfo) {
    throw new Error("儀表板不存在");
  }

  const dashboardDir = FileManager.getDirectoryPath(dashboardInfo.config_path);
  const draftPath = FileManager.joinPaths(dashboardDir, "draft.json");

  let config: DashboardConfig;
  if (FileManager.exists(draftPath)) {
    const configContent = FileManager.readFile(draftPath);
    config = JSON.parse(configContent);
  } else {
    // 如果沒有草稿，讀取正式設定
    const configContent = FileManager.readFile(dashboardInfo.config_path);
    config = JSON.parse(configContent);
    // 並立刻建立一份草稿
    FileManager.saveFileWithPath(draftPath, config);
  }

  return { info: dashboardInfo, config };
};

export const saveDashboardDraft = (
  id: number,
  config: DashboardConfig
): void => {
  const dashboardInfo = DashboardManager.getDashboardById(id);
  if (!dashboardInfo) {
    throw new Error("儀表板不存在");
  }

  const dashboardDir = FileManager.getDirectoryPath(dashboardInfo.config_path);
  const draftPath = FileManager.joinPaths(dashboardDir, "draft.json");
  FileManager.saveFileWithPath(draftPath, config);
};

export const deleteDashboardDraft = (
  id: number
): void => {
  const dashboardInfo = DashboardManager.getDashboardById(id);
  if (!dashboardInfo) return;

  const dashboardDir = FileManager.getDirectoryPath(dashboardInfo.config_path);
  const draftPath = FileManager.joinPaths(dashboardDir, "draft.json");
  if (FileManager.exists(draftPath)) {
    FileManager.deleteFile(draftPath);
  }
};

export const updateDashboard = (
  id: number,
  name: string,
  description: string | undefined,
  config: DashboardConfig
): DashboardWithConfig => {
  const existingDashboard = DashboardManager.getDashboardById(id);
  if (!existingDashboard) {
    throw new Error("儀表板不存在");
  }

  // 檢查名稱衝突（排除自己）
  if (name !== existingDashboard.name) {
    const conflict = DashboardManager.getDashboardByName(name);
    if (conflict && conflict.id !== id) {
      throw new Error(`儀表板名稱 "${name}" 已存在`);
    }
  }

  // 更新 config 檔案
  FileManager.saveFileWithPath(existingDashboard.config_path, config);

  // 同步更新草稿
  const dashboardDir = FileManager.getDirectoryPath(existingDashboard.config_path);
  const draftPath = FileManager.joinPaths(dashboardDir, "draft.json");
  if (FileManager.exists(draftPath)) {
    FileManager.saveFileWithPath(draftPath, config);
  }

  // 更新資料庫記錄
  const updatedInfo = DashboardManager.updateDashboard({
    id,
    name,
    description,
  });

  return { info: updatedInfo, config };
};

export const deleteDashboard = (
  id: number
): { message: string } => {
  const dashboard = DashboardManager.getDashboardById(id);
  if (!dashboard) {
    throw new Error("儀表板不存在");
  }

  // 取得儀表板目錄並刪除整個目錄
  const dashboardDir = FileManager.getDirectoryPath(dashboard.config_path);
  FileManager.deleteDirectory(dashboardDir);

  DashboardManager.deleteDashboard(id);

  return { message: "儀表板已刪除" };
};

export const checkConflict = (
  name: string
): { name: string; isConflict: boolean } => {
  return {
    name,
    isConflict: DashboardManager.checkNameExists(name),
  };
};

const dashboardService = {
  createDashboard,
  getAllDashboards,
  getDashboardById,
  getDashboardDraft,
  saveDashboardDraft,
  deleteDashboardDraft,
  updateDashboard,
  deleteDashboard,
  checkConflict,
};

export default dashboardService;