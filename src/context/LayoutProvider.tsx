import { LayoutContext } from "./LayoutContext";
import { useLayoutStore } from "../stores/layoutStore";

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useLayoutStore();

  const toggleRightPanelEnabled = () => {
    store.setRightPanelEnabled(!store.rightPanelEnabled);
  };

  return (
    <LayoutContext.Provider
      value={{
        ...store,
        toggleRightPanelEnabled,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
