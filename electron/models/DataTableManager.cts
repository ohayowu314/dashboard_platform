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
    const existing = DataTableManager.getTableInfoByName(info.name);
    if (existing) {
      throw new Error(`Table with name ${info.name} already exists`);
    }
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
  /**
   * 檢查單一資料表名稱是否已存在
   * @param db better-sqlite3 實例
   * @param tableName 要檢查的名稱
   * @returns boolean, true 表示已存在衝突
   */
  checkSingleTableNameExist(tableName: string): boolean {
    const sql = `
        SELECT COUNT(*) AS count
        FROM tables
        WHERE name = ?
    `;

    // 使用 get() 獲取單一結果列
    const result = DatabaseManager.get(sql, [tableName]) as { count: number };

    // 檢查計數是否大於 0
    return result.count > 0;
  },
  /**
   * 批量檢查資料表名稱是否已存在
   * @param db better-sqlite3 實例
   * @param tableNames 要檢查的名稱陣列
   * @returns 已存在名稱的陣列
   */
  checkTableNamesExist(tableNames: string[]): string[] {
    if (tableNames.length === 0) {
      return [];
    }

    // 建立參數佔位符 (e.g., '?, ?, ?')
    const placeholders = tableNames.map(() => "?").join(", ");

    // 完整的 SQL 語句
    const sql = `
        SELECT name
        FROM tables
        WHERE name IN (${placeholders})
    `;

    // 執行查詢，並將 tableNames 作為參數傳入
    const existingRecords = DatabaseManager.all<Pick<DataTableInfo, "name">>(
      sql,
      tableNames
    );

    // 將結果轉換為單純的名稱陣列
    return existingRecords.map((o) => o.name);
  },
  /**
   * 當發生名稱衝突且需要 'rename' 時，計算一個新的不重複名稱。
   * @param originalName 發生衝突的純淨名稱 (例如: 'users')
   * @returns 新的、不重複的表格名稱 (例如: 'users_1' 或 'users')
   */
  getNewTableName(originalName: string): string {
    // 步驟 1: 建立查詢參數
    // \_\ 是字面上的底線，因為 LIKE 中的 '_' 是單個字符萬用字元。
    const patternPrefix = originalName + "/_";

    // 建立 SQL 查詢
    // 我們使用 WHERE name GLOB... 來更好地匹配起始字符並檢查數字結尾
    // 這裡我們假設使用更簡單的 LIKE 配合後端邏輯來處理
    const sql = `
        SELECT name
        FROM tables
        WHERE 
          name = @originalName 
          OR 
          name LIKE @patternPrefix || '%' ESCAPE '/'
    `;

    // 步驟 2: 執行查詢並獲取所有潛在衝突的名稱
    const existingNames = DatabaseManager.all<Pick<DataTableInfo, "name">>(
      sql,
      [
        {
          originalName: originalName,
          patternPrefix: patternPrefix,
        },
      ]
    ).map((row) => row.name) as string[];

    if (existingNames.length === 0) {
      // 這不應該發生，因為我們假設在呼叫這個函數時已經確認了衝突。
      // 但作為安全備份，如果沒有衝突，則返回原始名稱
      return originalName;
    }

    // 步驟 3: 計算下一個可用的序號 (TypeScript/JavaScript 邏輯)

    // 定義匹配 'name_N' 結構的正規表達式
    // 它匹配以 originalName + '_' 開頭，後面跟著一個或多個數字 (N) 的字串
    const regex = new RegExp(`^${originalName}_(\\d+)$`);
    const maxSuffix = existingNames
      .filter((name) => name !== originalName)
      .map((name) => {
        const match = name.match(regex);
        return match && match[1];
      })
      .reduce((prev, name) => {
        if (!name) return prev;
        // 提取匹配到的數字部分
        const suffix = parseInt(name, 10);
        prev = Math.max(prev, suffix);
        return prev;
      }, 0);

    // 步驟 4: 計算新的名稱
    const newSuffix = maxSuffix + 1;

    // 返回：原始名稱 + '_' + (maxSuffix + 1)
    return `${originalName}_${newSuffix}`;
  },
};
DataTableManager.init();
