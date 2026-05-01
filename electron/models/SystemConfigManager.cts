import { DatabaseManager } from "./DatabaseManager.cjs";

export const SystemConfigManager = {
  init: () => {
    DatabaseManager.run(`
      CREATE TABLE IF NOT EXISTS system_configs (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  },

  getConfig: (key: string): string | null => {
    const result = DatabaseManager.get<{ value: string }>(
      "SELECT value FROM system_configs WHERE key = ?",
      [key]
    );
    return result?.value ?? null;
  },

  setConfig: (key: string, value: string): void => {
    DatabaseManager.run(
      "INSERT OR REPLACE INTO system_configs (key, value) VALUES (?, ?)",
      [key, value]
    );
  },

  deleteConfig: (key: string): void => {
    DatabaseManager.run("DELETE FROM system_configs WHERE key = ?", [key]);
  },
};

SystemConfigManager.init();
