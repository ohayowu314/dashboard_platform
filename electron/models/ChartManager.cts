import { ChartInfo } from "shared/types/chart";
import { DatabaseManager } from "../models/DatabaseManager.cjs";

export const ChartManager = {
  init: () => {
    DatabaseManager.run(`
      CREATE TABLE IF NOT EXISTS charts (
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
  getAllCharts: (): ChartInfo[] => {
    return DatabaseManager.all<ChartInfo>("SELECT * FROM charts");
  },
  getChartById: (id: number): ChartInfo | undefined => {
    return DatabaseManager.get<ChartInfo>("SELECT * FROM charts WHERE id = ?", [
      id,
    ]);
  },
  addChart: (
    chart: Omit<ChartInfo, "id" | "created_at" | "updated_at">
  ): ChartInfo => {
    const result = DatabaseManager.run(
      "INSERT INTO charts (name, description, config_path, preview_path) VALUES (?, ?, ?, ?)",
      [chart.name, chart.description, chart.config_path, chart.preview_path]
    );
    return ChartManager.getChartById(result.lastInsertRowid as number)!;
  },
  updateChart: (chart: {
    id: number;
    name?: string;
    description?: string;
    config_path?: string;
    preview_path?: string;
  }): ChartInfo => {
    const fields = [];
    const values = [];
    if (chart.name !== undefined) {
      fields.push("name = ?");
      values.push(chart.name);
    }
    if (chart.description !== undefined) {
      fields.push("description = ?");
      values.push(chart.description);
    }
    if (chart.config_path !== undefined) {
      fields.push("config_path = ?");
      values.push(chart.config_path);
    }
    if (chart.preview_path !== undefined) {
      fields.push("preview_path = ?");
      values.push(chart.preview_path);
    }
    if (fields.length === 0) {
      throw new Error("No fields to update");
    }
    values.push(chart.id);
    const sql = `UPDATE charts SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    DatabaseManager.run(sql, values);
    return ChartManager.getChartById(chart.id)!;
  },
  deleteChart: (id: number): void => {
    DatabaseManager.run("DELETE FROM charts WHERE id = ?", [id]);
  },
};
ChartManager.init();
