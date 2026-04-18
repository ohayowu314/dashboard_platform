import type { DashboardInfo, DashboardConfig } from "shared/types/dashboard";
import { DatabaseManager } from "./DatabaseManager.cjs";

export const DashboardManager = {
  init: () => {
    DatabaseManager.run(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        config_path TEXT NOT NULL,
        preview_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  getAllDashboards: (): DashboardInfo[] => {
    return DatabaseManager.all<DashboardInfo>(
      "SELECT * FROM dashboards ORDER BY updated_at DESC"
    );
  },

  getDashboardById: (id: number): DashboardInfo | undefined => {
    return DatabaseManager.get<DashboardInfo>(
      "SELECT * FROM dashboards WHERE id = ?",
      [id]
    );
  },

  getDashboardByName: (name: string): DashboardInfo | undefined => {
    return DatabaseManager.get<DashboardInfo>(
      "SELECT * FROM dashboards WHERE name = ?",
      [name]
    );
  },

  addDashboard: (
    dashboard: Omit<DashboardInfo, "id" | "created_at" | "updated_at">
  ): DashboardInfo => {
    const result = DatabaseManager.run(
      "INSERT INTO dashboards (name, description, config_path, preview_path) VALUES (?, ?, ?, ?)",
      [
        dashboard.name,
        dashboard.description,
        dashboard.config_path,
        dashboard.preview_path,
      ]
    );
    return DashboardManager.getDashboardById(
      result.lastInsertRowid as number
    ) as DashboardInfo;
  },

  updateDashboard: (
    dashboard: { id: number } & Partial<{
      name: string;
      description: string;
      config_path: string;
      preview_path: string;
    }>
  ): DashboardInfo => {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (dashboard.name !== undefined) {
      fields.push("name = ?");
      values.push(dashboard.name);
    }
    if (dashboard.description !== undefined) {
      fields.push("description = ?");
      values.push(dashboard.description);
    }
    if (dashboard.config_path !== undefined) {
      fields.push("config_path = ?");
      values.push(dashboard.config_path);
    }
    if (dashboard.preview_path !== undefined) {
      fields.push("preview_path = ?");
      values.push(dashboard.preview_path);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(dashboard.id);
    const sql = `UPDATE dashboards SET ${fields.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    DatabaseManager.run(sql, values);
    return DashboardManager.getDashboardById(dashboard.id as number) as DashboardInfo;
  },

  deleteDashboard: (id: number): void => {
    DatabaseManager.run("DELETE FROM dashboards WHERE id = ?", [id]);
  },

  checkNameExists: (name: string): boolean => {
    const result = DatabaseManager.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM dashboards WHERE name = ?",
      [name]
    );
    return (result?.count ?? 0) > 0;
  },
};

DashboardManager.init();