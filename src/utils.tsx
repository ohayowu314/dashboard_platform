// src/utils.tsx
import Papa from "papaparse";
import type {
  DataTableHeaderSchema,
  DataTableWithInfo,
  TableId,
} from "shared/types/dataTable";
import { MAX_FILE_SIZE } from "./constants";
import { ValidationError } from "./types";

// 為了更清晰地傳遞標準 JSON 範例，我們定義一個包含範例的特定錯誤訊息
export const STANDARD_JSON_EXAMPLE = `[
    {
        "欄位1": 1,
        "欄位2": 2,
        "欄位3": 3
    },
    {
        "欄位1": 4,
        "欄位2": 5,
        "欄位3": 6
    }
]`;

// 針對 PapaParse 的資料，定義一個更精確的型別
interface PapaResultRow {
  [key: string]: string | number;
}

const isValueOrArray = (item: unknown): boolean => {
  return typeof item !== "object" || item === null || Array.isArray(item);
};

export const isSameKeys = (obj1: object, obj2: object): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every((key) => keys2.includes(key));
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFile = (
  file: File,
  options: {
    allowedTypes: string[];
    maxSize?: number;
  },
): ValidationResult => {
  if (!file) {
    return { valid: false, error: "檔案不存在" };
  }

  const maxSize = options.maxSize ?? MAX_FILE_SIZE;
  if (file.size > maxSize) {
    return { valid: false, error: "檔案太大" };
  }

  if (file.size === 0) {
    return { valid: false, error: "檔案為空" };
  }

  if (
    options.allowedTypes.length > 0 &&
    !options.allowedTypes.includes(file.type)
  ) {
    return { valid: false, error: "不支援的檔案類型" };
  }

  return { valid: true };
};

export const parseDataFile = (file: File): Promise<DataTableHeaderSchema> => {
  return new Promise((resolve, reject) => {
    const validation = validateFile(file, {
      allowedTypes: ["text/csv", "application/json"],
      maxSize: MAX_FILE_SIZE,
    });

    if (!validation.valid) {
      return reject(new Error(validation.error));
    }

    if (file.type === "text/csv") {
      // 在 PapaParse 的 .parse 方法中，使用泛型來指定資料型別
      Papa.parse<PapaResultRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error(results.errors);
            return reject(new Error("CSV 解析失敗"));
          }
          const headers = results.meta.fields || [];
          // 將每個物件轉換為字串陣列，並確保型別正確
          const rows = results.data.map((row) => Object.values(row));
          resolve({ headers, rows });
        },
      });
    } else if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);

          if (!Array.isArray(data) || data.length === 0) {
            return reject(
              new ValidationError(`JSON 檔案格式不正確，應為陣列且不為空。`),
            );
          }

          const firstItem = data[0];
          const isAnyValueOrArray = data.some((item) => isValueOrArray(item));
          if (isAnyValueOrArray) {
            return reject(
              new ValidationError(
                `JSON 檔案內容格式不正確，陣列元素應為非陣列的物件。`,
              ),
            );
          }

          const headers = Object.keys(firstItem) as string[];

          // 檢查所有物件是否有相同的鍵
          const isConsistent = data.every((item) =>
            isSameKeys(firstItem, item),
          );
          if (!isConsistent) {
            return reject(
              new ValidationError(
                `JSON 檔案格式不正確，所有物件必須有相同的鍵。`,
              ),
            );
          }

          // 使用 map 迴圈遍歷每個項目，並透過 headers 陣列的順序取得值
          const rows = data.map((item: Record<string, unknown>) => {
            return headers.map((header) => {
              const value = item[header];
              return value === undefined ? "" : String(value);
            });
          });

          resolve({ headers, rows });
        } catch (error) {
          console.error(error);
          reject(new SyntaxError("JSON 檔案解析失敗。"));
        }
      };
      reader.onerror = () => {
        reject(new Error("檔案讀取失敗。"));
      };
      reader.readAsText(file);
    } else {
      reject(new Error("不支援的檔案類型。"));
    }
  });
};

export const getDataTableWithInfo = (
  tableId: TableId,
): Promise<DataTableWithInfo> => {
  return window.api.getTable(tableId);
};

/**
 * 從檔名中移除副檔名，作為所需名稱。
 * 範例: "users.csv" -> "users"
 * 範例: "data.v1.json" -> "data.v1"
 * @param filename 包含副檔名的檔案名稱
 * @returns 移除副檔名後的純淨名稱
 */
export const getNameFromFile = (filename: string): string => {
  // 尋找最後一個點 ('.') 的位置
  const lastDotIndex = filename.lastIndexOf(".");

  // 如果沒有找到點，或者點是第一個字元 (例如 '.DS_Store' 這種情況，雖然不常見)，
  // 則返回原始名稱。
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return filename;
  }

  // 返回從開頭到最後一個點之前的子字串
  return filename.substring(0, lastDotIndex);
};

export const parseDashboardFile = (file: File): Promise<object> => {
  return new Promise((resolve, reject) => {
    const validation = validateFile(file, {
      allowedTypes: ["application/json"],
      maxSize: MAX_FILE_SIZE,
    });

    if (!validation.valid) {
      return reject(new Error(validation.error));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        console.error(error);
        reject(new SyntaxError("JSON 檔案解析失敗。"));
      }
    };
    reader.onerror = () => {
      reject(new Error("檔案讀取失敗。"));
    };
    reader.readAsText(file);
  });
};
