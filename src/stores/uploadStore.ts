// src/stores/uploadStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { parseDataFile } from "../utils";
import type { DataTableInfo } from "shared/types/dataTable";
import type { FileConflictAction } from "../types";
import type { UploadMode } from "shared/types/index";

// ----------------------------------------------------
// 1. 調整介面以匹配 UploadDataTableDialog 傳入的資料結構
// ----------------------------------------------------

// Store 中每個上傳任務的狀態介面（保持不變）
export interface FileUploadStatus {
  id: string; // 使用檔案名稱加時間戳加隨機數作為唯一 ID
  fileName: string; // 包含副檔名的原始檔名
  status: "uploading" | "success" | "failed";
  progress?: number;
  error?: string;
  errorName?: string;
  info?: DataTableInfo;
  timeoutId?: ReturnType<typeof setTimeout>;
  isExpanded?: boolean;
}

// 從對話框傳入的檔案狀態介面 (應與對話框中的 FileStatus 匹配)
interface UploadInputStatus {
  id: string; // 包含副檔名的原始檔名
  tableName: string; // 移除副檔名後的純淨表格名稱 (例如: 'users')
  file: File;
  isConflict: boolean;
  conflictAction: FileConflictAction; // "rename" | "replace" | "skip"
}

// ----------------------------------------------------
// 2. 更新 Store State 介面
// ----------------------------------------------------
interface UploadState {
  uploads: FileUploadStatus[];
  addUpload: (file: File) => string;
  updateUploadStatus: (
    id: string,
    status: FileUploadStatus["status"],
    info?: DataTableInfo,
    error?: string,
    errorName?: string
  ) => void;
  // 更新 startUploads 參數類型
  startUploads: (filesStatus: UploadInputStatus[]) => Promise<void>;
  reset: () => void;
  removeUpload: (id: string) => void;
  toggleExpand: (id: string) => void;
}

export const useUploadStore = create<UploadState>()(
  devtools(
    (set, get) => ({
      uploads: [],

      // addUpload, updateUploadStatus, removeUpload, toggleExpand, reset 保持不變...
      addUpload: (file: File) => {
        const newId = `${file.name}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        set((state) => ({
          uploads: [
            ...state.uploads,
            {
              id: newId,
              fileName: file.name,
              status: "uploading",
              isExpanded: false,
            },
          ],
        }));
        return newId;
      },

      updateUploadStatus: (id, status, info, error, errorName) => {
        set((state) => ({
          uploads: state.uploads.map((upload) =>
            upload.id === id
              ? { ...upload, status, info, error, errorName, isExpanded: false }
              : upload
          ),
        }));
      },

      removeUpload: (id) => {
        set((state) => ({
          uploads: state.uploads.filter((upload) => upload.id !== id),
        }));
      },

      toggleExpand: (id) => {
        set((state) => ({
          uploads: state.uploads.map((upload) =>
            upload.id === id
              ? { ...upload, isExpanded: !upload.isExpanded }
              : upload
          ),
        }));
      },

      reset: () => {
        set({ uploads: [] });
      },

      // ----------------------------------------------------
      // 3. 重構 startUploads 邏輯：處理 conflictAction
      // ----------------------------------------------------
      startUploads: async (filesStatus: UploadInputStatus[]) => {
        const { updateUploadStatus, addUpload, removeUpload } = get();

        // 使用 Promise.allSettled 允許並行上傳，並確保所有任務都完成
        const uploadPromises = filesStatus
          // 步驟 1: 忽略所有 conflictAction 為 'skip' 的檔案
          .filter((fileStatus) => fileStatus.conflictAction !== "skip")
          .map(async (fileStatus) => {
            const newId = addUpload(fileStatus.file); // 新增到 uploads 列表

            // 決定最終要使用的表格名稱
            const finalTableName = fileStatus.tableName;
            const uploadMode: UploadMode =
              fileStatus.isConflict && fileStatus.conflictAction === "replace"
                ? "replace"
                : "create"; // 傳遞給後端的模式

            try {
              // 步驟 2: 解析檔案數據
              const parsedData = await parseDataFile(fileStatus.file);

              // 步驟 3: 準備傳遞給後端的 TableInfo
              const tableInfo = {
                name: finalTableName,
                description: "", // 預設為空
              };

              // 步驟 4: 呼叫後端 API 執行上傳
              const dataTableInfo = await window.api.uploadTable(
                tableInfo,
                parsedData,
                uploadMode
              );

              // 步驟 5: 更新狀態為成功
              updateUploadStatus(newId, "success", dataTableInfo);

              // 步驟 6: 成功後設定定時器移除
              setTimeout(() => {
                removeUpload(newId);
              }, 10000);
            } catch (e: unknown) {
              console.error(`上傳 ${fileStatus.id} 失敗:`, e);
              const errorMsg = e instanceof Error ? e.message : "未知錯誤";
              const errorName = e instanceof Error ? e.name : "Error";

              // 步驟 7: 更新狀態為失敗
              updateUploadStatus(
                newId,
                "failed",
                undefined,
                errorMsg,
                errorName
              );

              // 步驟 8: 失敗後設定定時器移除
              setTimeout(() => {
                removeUpload(newId);
              }, 30000);
            }
          });

        // 等待所有上傳操作完成 (無論成功或失敗)
        await Promise.allSettled(uploadPromises);
      },
    }),
    { name: "upload-store" }
  )
);
