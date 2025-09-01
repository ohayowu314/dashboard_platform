// src/context/useLayoutContext.tsx
import { useContext } from "react";
import { LayoutContext } from "./LayoutContext";

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context)
    throw new Error("useLayoutContext 必須在 LayoutProvider 中使用");
  return context;
};
