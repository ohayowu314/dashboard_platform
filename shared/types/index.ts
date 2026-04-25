export interface Message {
  message: string;
}
export interface ConflictResult {
  name: string;
  isConflict: boolean;
}

export type UploadMode = "create" | "replace";
export type FileId = number;
export interface FileInfo {
  id: FileId;
  name: string;
  description?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  fileSize?: string | number;
}
export type UploadInputInfo = Pick<FileInfo, "name" | "description">;

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export class Ok<T, _> {
  readonly type = "ok" as const;
  constructor(public value: T) { }
}

export class Err<_, E> {
  readonly type = "err" as const;
  constructor(public error: E) { }
}
