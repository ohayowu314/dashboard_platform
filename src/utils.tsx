// src/utils.tsx
import Papa from "papaparse";
import type { ParsedData } from "./types";

// 針對 PapaParse 的資料，定義一個更精確的型別
interface PapaResultRow {
  [key: string]: string | number;
}

export const parseDataFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
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
            return reject(new Error("JSON 檔案格式不正確，應為陣列且不為空。"));
          }

          const firstItem = data[0];
          if (typeof firstItem !== "object" || firstItem === null) {
            return reject(
              new Error("JSON 檔案內容格式不正確，陣列元素應為物件。")
            );
          }

          const headers = Object.keys(firstItem) as string[];

          // 使用 map 迴圈遍歷每個項目，並透過 headers 陣列的順序取得值
          const rows = data.map((item: { [key: string]: undefined }) => {
            return headers.map((header) => String(item[header]));
          });

          resolve({ headers, rows });
        } catch (error) {
          console.error(error);
          reject(new Error("JSON 檔案解析失敗。"));
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
