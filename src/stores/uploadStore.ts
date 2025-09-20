// src/stores/uploadStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { parseDataFile } from "../utils";
import type { DataTableInfo } from "shared/types/dataTable";

export interface FileUploadStatus {
  id: string; // 使用檔案名稱加時間戳加隨機數作為唯一 ID
  fileName: string;
  status: "uploading" | "success" | "failed";
  progress?: number;
  error?: string;
  info?: DataTableInfo;
  timeoutId?: ReturnType<typeof setTimeout>; // 用於儲存定時器 ID
}

interface UploadState {
  uploads: FileUploadStatus[];
  addUpload: (file: File) => string; // 回傳新建立的 ID
  updateUploadStatus: (
    id: string,
    status: FileUploadStatus["status"],
    info?: DataTableInfo,
    error?: string
  ) => void;
  // 處理上傳檔案的非同步邏輯
  startUploads: (files: File[]) => Promise<void>;
  reset: () => void;
  removeUpload: (id: string) => void; // 新增移除方法
}

export const useUploadStore = create<UploadState>()(
  devtools(
    (set, get) => ({
      uploads: [],

      addUpload: (file: File) => {
        const newId = `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => ({
          uploads: [
            ...state.uploads,
            { id: newId, fileName: file.name, status: "uploading" },
          ],
        }));
        return newId;
      },

      updateUploadStatus: (id, status, info, error) => {
        set((state) => ({
          uploads: state.uploads.map((upload) =>
            upload.id === id ? { ...upload, status, info, error } : upload
          ),
        }));
      },

      removeUpload: (id) => {
        set((state) => ({
          uploads: state.uploads.filter((upload) => upload.id !== id),
        }));
      },

      startUploads: async (files: File[]) => {
        const { updateUploadStatus, addUpload, removeUpload } = get();

        // 遍歷所有檔案並開始上傳
        for (const file of files) {
          const newId = addUpload(file);
          try {
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
            updateUploadStatus(newId, "success", dataTableInfo);
            // 成功後設定定時器
            setTimeout(() => {
              removeUpload(newId);
            }, 10000); // 10 秒後自動移除
          } catch (e: unknown) {
            console.error(`上傳 ${file.name} 失敗:`, e);
            const errorMsg = e instanceof Error ? e.message : "未知錯誤";
            // 更新狀態為失敗
            updateUploadStatus(newId, "failed", undefined, errorMsg);
            // 失敗後設定定時器
            setTimeout(() => {
              removeUpload(newId);
            }, 30000); // 30 秒後自動移除
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
