// src/components/layout/PageWrapper.tsx
import { useEffect } from "react";
import { useLayoutContext } from "../../context/useLayoutContext";
import type { PageConfig } from "../../types";

export const PageWrapper: React.FC<PageConfig> = ({
  tocItems,
  breadcrumb,
  rightPanel,
  content,
}) => {
  const {
    setTocItems,
    setBreadcrumb,
    setRightPanelContent,
    setRightPanelEnabled,
  } = useLayoutContext();

  useEffect(() => {
    setTocItems(tocItems);
    setBreadcrumb(breadcrumb);
    if (rightPanel) {
      setRightPanelContent(rightPanel);
      setRightPanelEnabled(true);
    } else {
      setRightPanelEnabled(false);
      setRightPanelContent(null);
    }
  }, []);

  return <>{content}</>;
};
