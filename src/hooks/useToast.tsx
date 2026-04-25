// src/hooks/useToast.tsx
import { useToastStore } from "../stores/toastStore";

export const useToast = () => {
  const { open, message, severity, showToast, closeToast } = useToastStore();

  return {
    open,
    message,
    severity,
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
    info: (msg: string) => showToast(msg, "info"),
    warning: (msg: string) => showToast(msg, "warning"),
    close: closeToast,
  };
};
