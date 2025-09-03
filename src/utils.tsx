// src/utils.tsx
import Papa from "papaparse";

interface ParsedData {
  headers: string[];
  rows: string[][];
}

export const parseFile = (file: File): Promise<ParsedData> => {
  return new Promise((resolve, reject) => {
    if (file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error(results.errors);
            return reject(new Error("CSV 解析失敗"));
          }
          const headers = results.meta.fields || [];
          const rows = results.data.map(Object.values) as string[][];
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

          const headers = Object.keys(data[0]);
          const rows = data.map((item: any) => Object.values(item));

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
