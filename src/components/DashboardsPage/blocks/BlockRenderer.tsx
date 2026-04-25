import type { DashboardBlock } from "shared/types/dashboard";
import { ChartBlock } from "./ChartBlock";

interface BlockRendererProps {
  block: DashboardBlock;
}

export const BlockRenderer = ({ block }: BlockRendererProps) => {
  return <ChartBlock config={block.config} />;
};

export default BlockRenderer;