import { IpcMainInvokeEvent } from "electron";

export type IpcMainListener<T extends any[] = any[], R = unknown> = (
  event: IpcMainInvokeEvent,
  ...args: T
) => Promise<R> | R;
