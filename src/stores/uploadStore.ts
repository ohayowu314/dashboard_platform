// src/stores/uploadStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { parseDataFile } from "../utils";
import type { DataTableInfo } from "shared/types/dataTable";

export interface FileUploadStatus {
  id: string; // 使用檔案名稱作為唯一 ID
  fileName: string;
  status: "uploading" | "success" | "failed";
  progress?: number;
  error?: string;
  info?: DataTableInfo;
}

interface UploadState {
  uploads: FileUploadStatus[];
  addUpload: (file: File) => void;
  updateUploadStatus: (
    fileName: string,
    status: FileUploadStatus["status"],
    info?: DataTableInfo,
    error?: string
  ) => void;
  // 處理上傳檔案的非同步邏輯
  startUploads: (files: File[]) => Promise<void>;
  reset: () => void;
}

export const useUploadStore = create<UploadState>()(
  devtools(
    (set, get) => ({
      uploads: [],

      addUpload: (file: File) => {
        set((state) => ({
          uploads: [
            ...state.uploads,
            { id: file.name, fileName: file.name, status: "uploading" },
          ],
        }));
      },

      updateUploadStatus: (fileName, status, info, error) => {
        set((state) => ({
          uploads: state.uploads.map((upload) =>
            upload.fileName === fileName
              ? { ...upload, status, info, error }
              : upload
          ),
        }));
      },

      startUploads: async (files: File[]) => {
        const { updateUploadStatus, addUpload } = get();

        // 遍歷所有檔案並開始上傳
        for (const file of files) {
          addUpload(file);
          try {
            // 模擬解析檔案
            const parsedData = await parseDataFile(file);
            // 呼叫後端 API
            const tableInfo = {
              name: file.name.split(".")[0],
              description: "",
            };
            const dataTableInfo = await window.api.uploadTable(
              tableInfo,
              parsedData
            );
            // 更新狀態為成功
            updateUploadStatus(file.name, "success", dataTableInfo);
          } catch (e: unknown) {
            console.error(`上傳 ${file.name} 失敗:`, e);
            const errorMsg = e instanceof Error ? e.message : "未知錯誤";
            // 更新狀態為失敗
            updateUploadStatus(file.name, "failed", undefined, errorMsg);
          }
        }
      },

      reset: () => {
        set({ uploads: [] });
      },
    }),
    { name: "upload-store" } // 開發者工具名稱
  )
);
