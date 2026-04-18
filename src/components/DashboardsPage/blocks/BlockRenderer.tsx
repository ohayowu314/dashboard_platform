import type { DashboardBlock } from "shared/types/dashboard";
import { TextBlock } from "./TextBlock";
import { TableBlock } from "./TableBlock";
import { ChartBlock } from "./ChartBlock";

interface BlockRendererProps {
  block: DashboardBlock;
}

export const BlockRenderer = ({
  block,
}: BlockRendererProps) => {
  const { type, config } = block;

  switch (type) {
    case "text":
      return (
        <TextBlock
          config={config}
        />
      );

    case "table":
      return (
        <TableBlock
          config={config}
        />
      );

    case "chart":
      return (
        <ChartBlock
          config={config}
        />
      );

    default:
      return null;
  }
};

export default BlockRenderer;