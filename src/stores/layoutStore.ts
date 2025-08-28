// src/stores/layoutStore.ts
import { create } from "zustand";
import type { TocItem } from "../types";

export interface LayoutState {
  tocItems: TocItem[];
  setTocItems: (items: TocItem[]) => void;

  breadcrumb: string[];
  setBreadcrumb: (items: string[]) => void;

  rightPanelContent: React.ReactNode | null;
  setRightPanelContent: (content: React.ReactNode | null) => void;

  rightPanelEnabled: boolean;
  setRightPanelEnabled: (enabled: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  tocItems: [],
  setTocItems: (items) => set({ tocItems: items }),

  breadcrumb: [],
  setBreadcrumb: (items) => set({ breadcrumb: items }),

  rightPanelContent: null,
  setRightPanelContent: (content) => set({ rightPanelContent: content }),

  rightPanelEnabled: false,
  setRightPanelEnabled: (enabled) => set({ rightPanelEnabled: enabled }),
}));
