// src/stores/uploadStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { FileConflictAction } from "../types";
import type { FileInfo, UploadMode } from "shared/types/index";

// 假設所有資源的 Info 類型都不同，我們使用一個泛型類型或 unknown
// 成功上傳後後端返回的資訊類型
type ResourceInfo = FileInfo;

// ----------------------------------------------------
// 1. 通用化 Store 中每個上傳任務的狀態介面
// ----------------------------------------------------
export interface FileUploadStatus {
  id: string;
  fileName: string;
  status: "uploading" | "success" | "failed";
  progress?: number;
  error?: string;
  errorName?: string;
  info?: ResourceInfo; // 通用化
  timeoutId?: ReturnType<typeof setTimeout>;
  isExpanded?: boolean;
}

// ----------------------------------------------------
// 2. 通用化從對話框傳入的檔案狀態介面
// ----------------------------------------------------
export interface GenericUploadInputStatus {
  id: string;
  resourceName: string; // 從 tableName 通用化
  file: File;
  isConflict: boolean;
  conflictAction: FileConflictAction; // "rename" | "replace" | "skip"
}

// 3. 定義一個通用的上傳處理函式簽名
// 這個函式將在 Store 內部被呼叫，處理資源特有的解析和 API 呼叫邏輯
export type UploadHandler<T extends ResourceInfo> = (
  file: File,
  resourceName: string,
  uploadMode: UploadMode
) => Promise<T>;

// ----------------------------------------------------
// 4. 更新 Store State 介面
// ----------------------------------------------------
interface UploadState {
  uploads: FileUploadStatus[];
  addUpload: (file: File) => string;
  updateUploadStatus: (
    id: string,
    status: FileUploadStatus["status"],
    info?: ResourceInfo, // 通用化
    error?: string,
    errorName?: string
  ) => void;
  // 接受 UploadHandler 函式，由呼叫者提供
  startUploads: <T extends ResourceInfo>(
    filesStatus: GenericUploadInputStatus[],
    uploadHandler: UploadHandler<T>
  ) => Promise<void>;
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
      // 5. 重構 startUploads 邏輯：使用傳入的 uploadHandler
      // ----------------------------------------------------
      startUploads: async <T extends ResourceInfo>(
        filesStatus: GenericUploadInputStatus[],
        uploadHandler: UploadHandler<T> // 接收傳入的處理函式
      ) => {
        const { updateUploadStatus, addUpload, removeUpload } = get();

        // 使用 Promise.allSettled 允許並行上傳，並確保所有任務都完成
        const uploadPromises = filesStatus
          // 步驟 1: 忽略所有 conflictAction 為 'skip' 的檔案
          .filter((fileStatus) => fileStatus.conflictAction !== "skip")
          .map(async (fileStatus) => {
            const newId = addUpload(fileStatus.file); // 新增到 uploads 列表

            // 決定最終要使用的檔案名稱
            const finalResourceName = fileStatus.resourceName;
            const uploadMode: UploadMode =
              fileStatus.isConflict && fileStatus.conflictAction === "replace"
                ? "replace"
                : "create"; // 傳遞給後端的模式

            try {
              // 步驟 2: 解析檔案數據並呼叫後端上傳
              // 呼叫傳入的通用處理函式來執行上傳
              const resourceInfo = await uploadHandler(
                fileStatus.file,
                finalResourceName,
                uploadMode
              );

              // 步驟 3: 更新狀態為成功
              updateUploadStatus(newId, "success", resourceInfo);

              // 步驟 4: 成功後設定定時器移除
              setTimeout(() => {
                removeUpload(newId);
              }, 10000);
            } catch (e: unknown) {
              // 處理錯誤
              console.error(`上傳 ${fileStatus.id} 失敗:`, e);
              const errorMsg = e instanceof Error ? e.message : "未知錯誤";
              const errorName = e instanceof Error ? e.name : "Error";

              // 步驟 5: 更新狀態為失敗
              updateUploadStatus(
                newId,
                "failed",
                undefined,
                errorMsg,
                errorName
              );

              // 步驟 6: 失敗後設定定時器移除
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
