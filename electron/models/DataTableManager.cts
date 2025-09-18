import { DataTableInfo, TableId } from "shared/types/dataTable";
import { DatabaseManager } from "../models/DatabaseManager.cjs";

export const DataTableManager = {
  init: () => {
    DatabaseManager.run(`CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      file_path TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
  },
  getAllTableInfos: (): DataTableInfo[] => {
    return DatabaseManager.all(
      "SELECT id, name, description, file_path, created_at, updated_at FROM tables"
    );
  },
  getTableInfoById: (id: TableId): DataTableInfo | undefined => {
    return DatabaseManager.get<DataTableInfo>(
      "SELECT id, name, description, file_path, created_at, updated_at FROM tables WHERE id = ?",
      [id]
    );
  },
  getTableInfoByName: (name: string): DataTableInfo | undefined => {
    return DatabaseManager.get<DataTableInfo>(
      "SELECT id, name, description, file_path, created_at, updated_at FROM tables WHERE name = ?",
      [name]
    );
  },
  addTableInfo: (info: {
    name: string;
    description?: string;
    file_path: string;
  }): DataTableInfo => {
    const result = DatabaseManager.run(
      "INSERT INTO tables (name, description, file_path) VALUES (?, ?, ?)",
      [info.name, info.description, info.file_path]
    );
    return DataTableManager.getTableInfoById(result.lastInsertRowid as number)!; // 驚嘆號是 ts 標註，表示不可能是 undefined 或 null
  },
  updateTableInfo: (info: {
    id: TableId;
    name?: string;
    description?: string;
    file_path?: string;
  }): DataTableInfo => {
    const fields = [];
    const values = [];
    if (info.name !== undefined) {
      fields.push("name = ?");
      values.push(info.name);
    }
    if (info.description !== undefined) {
      fields.push("description = ?");
      values.push(info.description);
    }
    if (info.file_path !== undefined) {
      fields.push("file_path = ?");
      values.push(info.file_path);
    }
    if (fields.length === 0) {
      throw new Error("No fields to update");
    }
    values.push(info.id);
    const sql = `UPDATE tables SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    DatabaseManager.run(sql, values);
    return DataTableManager.getTableInfoById(info.id)!;
  },
  deleteTableInfo: (id: TableId): void => {
    DatabaseManager.run("DELETE FROM tables WHERE id = ?", [id]);
  },
};
DataTableManager.init();
