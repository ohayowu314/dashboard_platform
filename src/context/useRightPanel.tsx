// context/useRightPanel.tsx

import { useContext } from "react";
import { RightPanelContext } from "./RightPanelContext";

export const useRightPanel = () => useContext(RightPanelContext);
