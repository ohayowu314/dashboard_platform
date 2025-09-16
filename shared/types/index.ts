export interface ParsedData {
  headers: string[];
  rows: (string | number)[][];
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export class Ok<T, _> {
  readonly type = "ok" as const;
  constructor(public value: T) {}
}

export class Err<_, E> {
  readonly type = "err" as const;
  constructor(public error: E) {}
}
