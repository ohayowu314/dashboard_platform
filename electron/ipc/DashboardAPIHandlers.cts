import { IpcMainListener } from "../types.cjs";
import dashboardService from "../services/DashboardService.cjs";
import { DashboardConfig } from "shared/types/dashboard";

interface CreateDashboardInput {
  name: string;
  description?: string;
  config: DashboardConfig;
}

interface UpdateDashboardInput {
  id: number;
  name: string;
  description?: string;
  config: DashboardConfig;
}

export const DashboardAPIHandlers: Record<string, IpcMainListener> = {
  "create-dashboard": (
    _event,
    { name, description, config }: CreateDashboardInput
  ) => dashboardService.createDashboard(name, description, config),

  "get-all-dashboards": () => dashboardService.getAllDashboards(),

  "get-dashboard": (_event, id: number) =>
    dashboardService.getDashboardById(id),

  "update-dashboard": (
    _event,
    { id, name, description, config }: UpdateDashboardInput
  ) => dashboardService.updateDashboard(id, name, description, config),

  "delete-dashboard": (_event, id: number) =>
    dashboardService.deleteDashboard(id),

  "check-dashboard-conflict": (_event, name: string) =>
    dashboardService.checkConflict(name),
};