// stores/uiStore.ts
import { create } from "zustand";

interface UIState {
  rightPanelEnabled: boolean;
  rightPanelContent: React.ReactNode;
  setRightPanelEnabled: (enabled: boolean) => void;
  setRightPanelContent: (content: React.ReactNode) => void;
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelEnabled: true,
  rightPanelContent: null,
  setRightPanelEnabled: (enabled) => set({ rightPanelEnabled: enabled }),
  setRightPanelContent: (content) => set({ rightPanelContent: content }),
  rightPanelVisible: false,
  setRightPanelVisible: (visible) => set({ rightPanelVisible: visible }),
}));
