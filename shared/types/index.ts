export interface Message {
  message: string;
}
export interface ConflictResult {
  name: string;
  isConflict: boolean;
}

export type UploadMode = "create" | "replace";

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export class Ok<T, _> {
  readonly type = "ok" as const;
  constructor(public value: T) {}
}

export class Err<_, E> {
  readonly type = "err" as const;
  constructor(public error: E) {}
}
