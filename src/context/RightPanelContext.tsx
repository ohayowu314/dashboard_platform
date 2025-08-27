// context/RightPanelContext.tsx

import React, { createContext } from "react";

interface RightPanelContextType {
  setContent: (content: React.ReactNode) => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
}

export const RightPanelContext = createContext<RightPanelContextType>({
  setContent: () => { },
  setEnabled: () => { },
  toggleEnabled: () => { },
});
